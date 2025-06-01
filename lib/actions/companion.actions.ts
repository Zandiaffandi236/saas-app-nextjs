'use server';

import { auth } from "@clerk/nextjs/server"
import { createSupabaseClient } from "../supabase";

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from('companions').insert({ ...formData, author }).select();

  if (error || !data) throw new Error(error?.message || 'Failed to create companion');

  return data[0];
}

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();

  let query;

  if (!userId) {
    query = supabase.from('companions').select();
  } else {
    query = supabase.from('companions').select('*, bookmark:bookmark(user_id)');
  }

  if (subject && topic) {
    query = query.or(
      `subject.ilike.%${subject}%,topic.ilike.%${topic}%,name.ilike.%${topic}%`
    );
  } else if (subject) {
    query = query.ilike('subject', `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  let companions;
  if (!userId) {
    companions = data;
  } else {
    companions = data.map((companion) => ({
      ...companion,
      bookmarked: companion.bookmark?.some((b: { user_id: string }) => b.user_id === userId) ?? false,
    }));
  }

  return companions;
}

export const getCompanion = async (id: string) => {
  const supabase = createSupabaseClient();

  const { data, error } =await supabase.from('companions').select().eq('id', id);

  if (error) return console.log(error);

  return data[0];
}

export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from('session_history').insert({
    companion_id: companionId,
    user_id: userId,
  });

  if (error) throw new Error(error.message);

  return data;
}

export const getRecentSession = async (limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('session_history')
    .select('companions:companion_id (*)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data.map(({ companions }) => companions);
}

export const getUserSession = async (limit = 10, userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('session_history')
    .select('companions:companion_id (*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data.map(({ companions }) => companions);
}

export const addUserBookmark = async (companionId: string, userId: string | null) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from('bookmark').insert({
    companion_id: companionId,
    user_id: userId,
  });

  if (error) throw new Error(error.message);

  return data;
}

export const removeUserBookmark = async (companionId: string, userId: string | null) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('bookmark')
    .delete()
    .eq('companion_id', companionId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  return data;
}

export const addBookmarkSession = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from('bookmark').insert({
    companion_id: companionId,
    user_id: userId,
  });

  if (error) throw new Error(error.message);

  return data;
}

export const getUserBookmark = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('bookmark')
    .select('companions:companion_id (*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message);

  return data.map(({ companions }) => companions);
}

export const getUserCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('companions')
    .select()
    .eq('author', userId)

  if (error) throw new Error(error.message);

  return data;
}

export const newCompanionPermissions = async () => {
  const { userId, has } = await auth();
  const supabase = createSupabaseClient();

  let limit = 0;

  if (has({ plan: 'pro_companion' })) {
    return true;
  } else if (has({ feature: '3_active_companions' })) {
    limit = 3;
  } else if (has({ feature: '10_active_companions' })) {
    limit = 10;
  }

  const { data, error } = await supabase
    .from('companions')
    .select('id', { count: 'exact' })
    .eq('author', userId);

  if (error) throw new Error(error.message);

  const companionCount = data?.length;

  if (companionCount >= limit) {
    return false;
  } else {
    return true;
  }
};

export const newSessionPermissions = async () => {
  const { userId, has } = await auth();
  const supabase = createSupabaseClient(); 
  const date = new Date();

  let limit = 0;

  if (has({ plan: 'pro_companion' })) {
    return true;
  } else if (has({ plan: 'core_learner' })) {
    return true;
  } else if (has({ feature: '10_conversation_month' })) {
    limit = 10;
  }

  const month = date.getMonth();
  const year = date.getFullYear();
  const fromDate = new Date(year, month, 1);
  const toDate = new Date(year, month + 1, 1);
  
  const { data, error } = await supabase
    .from('session_history')
    .select('created_at, user_id', { count: 'exact' })
    .eq('user_id', userId)
    .gte('created_at', fromDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    .lt('created_at', toDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))

  if (error) throw new Error(error.message);

  const sessionCount = data?.length;

  if (sessionCount >= limit) {
    return false;
  } else {
    return true;
  }
};
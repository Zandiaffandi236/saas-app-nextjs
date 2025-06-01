import CompanionComponent from "@/components/CompanionComponent";
import { getCompanion, newSessionPermissions } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface CompanionSessionPageProps {
  params: Promise<{ id: string }>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
  const { id } = await params;
  const companion = await getCompanion(id);
  const user = await currentUser();
  const hasNewSession = await newSessionPermissions();

  const { name, subject, title, topic, duration } = companion;

  if (!user) redirect('/sign-in');
  if (!name) redirect('/companions');

  return (
    <main>
      <article className="flex justify-between rounded-border p-6 max-md:flex-col">
        <div className="flex items-center gap-2">
          <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden" style={{ backgroundColor: getSubjectColor(subject)}}>
            <Image 
              src={`/icons/${subject}.svg`}
              alt={subject}
              width={35}
              height={35}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="font-bold text-2xl">{name}</p>

              <div className="subject-badge max-sm:hidden">
                {subject}
              </div>
            </div>

            <p className="text-lg">{topic}</p>
          </div>
        </div>

        <div className="items-start items-2xl max-md:hidden">
          {duration} minutes
        </div>
      </article>

      {hasNewSession ? (
        <CompanionComponent 
          {...companion}
          companionId={id}
          userName={user.firstName}
          userImage={user.imageUrl}
        />
      ) : (
        <article className='companion-limit'>
          <Image src='/images/limit.svg' alt='Companion limit reached' width={360} height={230} />

          <div className="cta-badge">
            Upgrade Your Plan!
          </div>

          <h1>You’ve Reached Your Limit</h1>

          <p>You’ve reached your session limit. Wait until next month or upgrade to start more sessions and premium features.</p>

          <div className="flex flex-col gap-4 justify-center items-center">
          <Link href='/' className='w-full justify-center btn-primary-outline'>
            Wait Next Month
          </Link>

          <p>or</p>
          
          <Link href='/subscription' className='btn-primary w-full justify-center'>
            Upgrade My Plan
          </Link>
          </div>
        </article>
      )}
    </main>
  )
}

export default CompanionSession
'use client';

import { addUserBookmark, removeUserBookmark } from "@/lib/actions/companion.actions";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  bookmarked: boolean;
  userId: string | null;
  color: string;
}

const CompanionCard = ({ id, name, topic, subject, duration, bookmarked: initialBookmarked, userId, color }: CompanionCardProps) => {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    if (!userId || loading) return;

    setLoading(true);
    try {
      if (bookmarked) {
        await removeUserBookmark(id, userId);
        setBookmarked(false);
        toast.success(`${name} removed from Bookmark!`);
      } else {
        await addUserBookmark(id, userId);
        setBookmarked(true);
        toast.success(`${name} added to Bookmark!`);
      }
    } catch (error) {
      console.error('Bookmark action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="companion-card" style={{ backgroundColor: color }}>
      <div className="flex justify-between items-center">
        <div className="subject-badge">{subject}</div>
        <button 
          className={cn(
            "companion-bookmark",
            !userId && "hidden"
          )}
          onClick={handleBookmark}
        >
          <Image 
            src={ bookmarked ? '/icons/bookmark-filled.svg' : '/icons/bookmark.svg'}
            alt="bookmark"
            width={12.5}
            height={15}
          />
        </button>
      </div>

      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-sm">{topic}</p>
      <div className="flex items-center gap-2">
        <Image 
          src='/icons/clock.svg'
          alt="duration"
          width={13.5}
          height={13.5}
        />
        <p className="text-sm">{duration} minutes</p>
      </div>

      <Link href={`companions/${id}`} className="w-full">
        <button className="btn-primary w-full justify-center">
          Launch Lesson
        </button>
      </Link>
    </article>
  )
}

export default CompanionCard
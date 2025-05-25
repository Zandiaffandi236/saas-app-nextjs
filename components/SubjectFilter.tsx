'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { subjects } from "@/constants";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";


const SubjectFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('subject') || '';

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let newUrl = '';
    if (searchQuery && searchQuery !== 'all') {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'subject',
        value: searchQuery
      });

      router.push(newUrl, { scroll: false });
    } else {
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ['subject']
      });

      router.push(newUrl, { scroll: false });
    }

  }, [searchQuery, searchParams, router]);

  return (
    <Select
      value={searchQuery}
      onValueChange={setSearchQuery}
    >
      <SelectTrigger className="input capitalize">
        <SelectValue placeholder="Select subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>All subject</SelectItem>
        {subjects.map((subject) => (
          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SubjectFilter
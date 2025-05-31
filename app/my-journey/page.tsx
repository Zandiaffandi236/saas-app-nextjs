import CompanionsList from "@/components/CompanionsList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getUserBookmark, getUserCompanions, getUserSession } from "@/lib/actions/companion.actions";
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect('/sign-in');

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSession(10, user.id);
  const bookmarkedCompanions = await getUserBookmark(user.id);

  return (
    <main className="min-lg:w-3/4">
      <section className="flex justify-between gap-4 max-sm:flex-col items-center">
        <div className="flex gap-4 items-center">
          <Image 
            src={user.imageUrl}
            alt={user.firstName!}
            width={110}
            height={110}
            className="rounded-lg"
          />

          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl">
              {user.firstName} {user.lastName}
            </h1>

            <p className="text-sm text-muted-foreground">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image src="/icons/check.svg" alt="checkmark" width={22} height={22} />

              <p className="text-2xl font-bold">
                {sessionHistory.length}
              </p>
            </div>

            <div>Lessons Completed</div>
          </div>

          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image src="/icons/cap.svg" alt="cap" width={22} height={22} />

              <p className="text-2xl font-bold">
                {companions.length}
              </p>
            </div>

            <div>Companions Created</div>
          </div>
        </div>
      </section>

      <Accordion type="multiple">
        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold">Recent Sessions</AccordionTrigger>
          <AccordionContent>
            {sessionHistory.length >= 1 ? (
              <CompanionsList 
                title="Recent Sessions"
                companions={sessionHistory}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold">You don't have any recent session</p>

                <Link href='/companions' className="btn-primary w-fit">
                  Let's Learn!
                </Link>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="companions">
          <AccordionTrigger className="text-2xl font-bold">Companions {`(${companions.length})`}</AccordionTrigger>
          <AccordionContent>
            {companions.length >= 1 ? (
              <CompanionsList 
                title="My Companions"
                companions={companions}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold">You don't have any companions yet</p>

                <Link href='/companions/new' className="btn-primary w-fit">
                  Create Your First Companion!
                </Link>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bookmark">
          <AccordionTrigger className="text-2xl font-bold">Bookmarked Companions {`(${bookmarkedCompanions.length})`}</AccordionTrigger>
          <AccordionContent>
            {bookmarkedCompanions.length >= 1 ? (
              <CompanionsList 
                title="My Companions"
                companions={bookmarkedCompanions}
              />
            ) : (
              <p className="text-sm font-bold">You don't have any Bookmarked Companions</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  )
}

export default Profile
import { PricingTable } from '@clerk/nextjs'
import React from 'react'

const Subscription = () => {
  return (
    <main className='flex flex-col items-center justify-center px-20 py-24 gap-28'>
      <div className="flex flex-col gap-4">
        <h1 className='font-bold text-[40px] text-center'>Choose Your Learning Journey</h1>
        <p className='text-[18px] text-center max-w-[588px]'>Start free, upgrade anytime. Unlock smarter Conversations, deeper insights, and unlimited potential with a plan that fits your goals.</p>
      </div>

      <PricingTable />
    </main>
  )
}

export default Subscription
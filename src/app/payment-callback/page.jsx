import PaymentCallback from '@/components/PaymentCallback/PaymentCallback'
import React ,{Suspense }from 'react'

const page = () => {
  return (
    <div>
                            <Suspense fallback={<div>Loading...</div>}>
        
        <PaymentCallback/>
                            </Suspense>
        
    </div>
  )
}

export default page
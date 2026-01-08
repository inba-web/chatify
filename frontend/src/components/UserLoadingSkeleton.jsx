import React from 'react'

const UserLoadingSkeleton = () => {
  return (
    <div className='space-y-2 sm:space-y-3 md:space-y-4'>
        {[1,2,3].map((item) => (
            <div key={item} className='bg-slate-800/30 p-2 sm:p-3 md:p-4 lg:p-5 rounded-lg animate-pulse'>
                <div className='flex items-center space-x-2 sm:space-x-3 md:space-x-4'>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-slate-700 rounded-full flex-shrink-0'></div>
                    <div className='flex-1'>
                        <div className='h-2 sm:h-3 md:h-4 bg-slate-700 rounded w-3/4 mb-1 sm:mb-2 md:mb-2'></div>  
                        <div className='h-2 sm:h-2 md:h-3 bg-slate-700/30 rounded w-1/2'></div>
                    </div>
                </div>
            </div>
        ))}
    </div>            
  ) 
}

export default UserLoadingSkeleton;

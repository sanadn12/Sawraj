import React from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AddButton = () => {
const router = useRouter();
  const handleadd =()=> {
    router.push('/addForm')
  }
  return (
    <button
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 border-4 bg-red-100 border-red-600  hover:bg-red-700 text-red-600 hover:text-white font-semibold text-xl px-8 md:px-10 py-4 md:py-6 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
   onClick={handleadd}
   >
      <Plus size={20} />
      Add Listing
    </button>
  );
};

export default AddButton;

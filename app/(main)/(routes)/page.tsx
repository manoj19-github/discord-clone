import { ModeToggle } from '@/components/toggle-dark'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='mx-5'>
      <ModeToggle/>
    </div>
  )
}

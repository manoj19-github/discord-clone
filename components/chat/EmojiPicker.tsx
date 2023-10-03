import React, { FC } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { Smile } from 'lucide-react';
import Picker from "@emoji-mart/react"
import PickerData from "@emoji-mart/data"

import { resolve } from 'path';
import { useTheme } from 'next-themes';
interface EmojiPickerProps{
    onChange:(value:string)=>void;

}
const EmojiPicker:FC<EmojiPickerProps> = ({onChange}):JSX.Element => {
    const {resolvedTheme } = useTheme();
  return (
    <Popover>
        <PopoverTrigger>
            <Smile className="transition-all text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"/>
        </PopoverTrigger>
        <PopoverContent side="right" sideOffset={40} className="bg-transparent border-none shadow-none drop-shadow-none mb-15">
            <Picker theme={resolvedTheme}  data={PickerData} onEmojiSelect={(emoji:any)=>onChange(emoji.native)}/>


        </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker
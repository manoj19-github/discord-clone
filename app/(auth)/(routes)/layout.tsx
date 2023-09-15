import React, { FC, ReactNode } from 'react'


interface LayoutProps{
    children:ReactNode
}
const Layout:FC<LayoutProps> = ({children}) => {
  return (
    <div className=' h-screen w-screen flex justify-center items-center'>{children}</div>
  )
}

export default Layout
import React from 'react'

const Banner = ({title, subtitle, linktext, onClick, backgroundImage}) => {
  return (
    <header
    className='flex flex-col gap-3 justify-center items-center w-full'
    style={{
        backgroundImage:`url(${backgroundImage})`,
        backgroundSize:`cover`,
        backgroundPosition:`center 56%`,
        backgroundRepeat:`no-repeat`,
        height:"68vh"
    }}
    >
        <h1 className='text-4xl text-white font-bold uppercase'>{title}</h1>
        <p>{subtitle}</p>
    </header>
  )
}

export default Banner
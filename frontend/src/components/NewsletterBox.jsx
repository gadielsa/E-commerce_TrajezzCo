import React from 'react'

const NewsletterBox = () => {

  const onSubmitHandler = (event) => {
    event.preventDefault()
  }

  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Se inscreva agora e ganhe 20% de desconto</p>
      <p className='text-gray-400 mt-3'>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a auctor diam, non rhoncus neque.
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Coloque seu email aqui' required/>
        <button type='submit' className='bg-black text-white text-xs px-10 py-4'>Inscrever-se</button>
      </form>
    </div>
  )
}

export default NewsletterBox

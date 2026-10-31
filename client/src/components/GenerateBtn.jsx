import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const GenerateBtn = () => {
    const {user, setShowLogin} = useContext(AppContext) 
    const navigate = useNavigate()
    const onClickHandler = ()=>{
        if(user){
            navigate('/result')
        } else {
            setShowLogin(true)
        }
    }
  return (
    <div className='pb-16 text-center '>
      <h1 className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16'>See the magic. Try now</h1>
        <button className='inline-flex sm:text-lg text-white bg-black m-auto cursor-pointer px-12 py-3 
         items-center gap-2 rounded-full hover:scale-105 transition-all duration-500'
         onClick={onClickHandler}
         >Generate images 
         <img className='h-6' src={assets.star_group} alt="" /></button>

      
    </div>
  )
}

export default GenerateBtn

import axios from 'axios'
import { useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setProfileData, setUserData } from '../utils/userSlice'
import { ClipLoader } from 'react-spinners'
import { serverUrl } from '../App'

const EditProfile = () => {
    const navigate =  useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.userSlice);
    const [fImage, setFImage] = useState("");
    const [backImage, setBackImage] = useState("");

    const hnadleImage = (e) => {
        const file = e.target.files[0];
        setFImage(URL.createObjectURL(file));
        setBackImage(file);
    };
      const [loading , setLoading] = useState(false)
      const [name , setName] = useState("")
      const [userName , setUserName] = useState("")
      const [bio , setBio] = useState( "")
      const [profession , setProfession] = useState( "")
      const [gender , setGender] = useState("")

       const handleProfileUpdate = async () => {
        setLoading(true)
        const formData = new FormData()
        formData.append("name" , name )
        formData.append("userName" , userName )
        formData.append("bio" , bio )
        formData.append("profession" , profession )
        formData.append("gender" , gender )
        if(backImage){
           formData.append("profilePic" , backImage )
        }
          try {
            const res = await axios.post(`${serverUrl}/api/user/update-profile` , formData , {withCredentials : true})
            console.log(res);
            dispatch(setProfileData(res.data.user))
            dispatch(setUserData(res.data.user))
            navigate("/")
            setLoading(false)
          } catch (error) {
            console.log(error);
            setLoading(false)
            
          }
       }
       
       
  return (
    <div className='bg-gray-900 px-5 py-5 w-full h-screen relative flex justify-center items-center'>
        <div onClick={()=> navigate(-1)} className='cursor-pointer flex gap-5 absolute left-10 top-10'>
          <FaArrowLeftLong  className="text-white text-2xl"  />
          <p className='text-white text-xl'>Edit Profile</p>
        </div>
        <div className='w-[600px] h-full  flex flex-col gap-5 justify-center px-10 py-2 items-center'>
          <div className='flex flex-col items-center gap-3'>
            <label htmlFor="id">
              {
                fImage ?
                <img
                 className="rounded-full w-25 h-25 cursor-pointer"
                 src={ fImage || `https://api.dicebear.com/9.x/initials/svg?seed=${user?.name}`}
                 alt="avatar"
               /> : <img
                 className="rounded-full w-25 h-25 cursor-pointer"
                 src={user?.profilePic}
                 alt="avatar"
               />
              }
            </label>
            <input type="file" id='id' className='hidden' onChange={hnadleImage} />
            <p className='text-blue-500 font-medium'>Change your Profile Picture</p>
          </div>
            <input type="text" defaultValue={user?.name}  onChange={(e)=> setName(e.target.value)}   placeholder='Enter your Name' className='w-full h-[60px] px-5  bg-gray-800 text-white rounded-xl  ' />
            <input type="text" defaultValue={user?.userName} onChange={(e)=> setUserName(e.target.value)}  placeholder='Enter your userName' className='w-full h-[60px] px-5 bg-gray-800 text-white rounded-xl  ' />
            <input type="text" defaultValue={user?.bio}  onChange={(e)=> setBio(e.target.value)} placeholder='Enter your Bio' className='w-full h-[60px] px-5 bg-gray-800 text-white rounded-xl  ' />
            <input type="text" defaultValue={user?.profession} onChange={(e)=> setProfession(e.target.value)}  placeholder='Enter your Profession' className='w-full h-[60px] px-5 bg-gray-800 text-white rounded-xl  ' />
            <input type="text" defaultValue={user?.gender} onChange={(e)=> setGender(e.target.value)}  placeholder='Enter your Gender' className='w-full h-[60px] px-5 bg-gray-800 text-white rounded-xl  ' />
            <button onClick={handleProfileUpdate} className='w-10/12 bg-blue-500 py-3 text-white font-semibold rounded-xl cursor-pointer'>{!loading ? "Save Profile" : <ClipLoader color="#fff" size={25} /> }</button>
        </div>
    </div>
  )
}

export default EditProfile
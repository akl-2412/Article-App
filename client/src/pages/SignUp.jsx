import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import {ACCOUNT_TYPE} from "../utils/constants"
import Tab from "../components/Tab"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import  { toast } from "react-hot-toast";
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accountType,setAccountType] = useState(ACCOUNT_TYPE.STUDENT);
  const [showPassword,setShowPassword]=useState(false);
  useEffect(()=>{
    setFormData({...formData,accountType:accountType})
    //console.log(accountType);
  },[accountType])
  
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ]
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
   // console.log(formData);

  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {

      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error("Something went wrong");
        setLoading(false);
        return setErrorMessage(data.message);
      }
      
      if(res.ok) {
        toast.success("Sign-Up successfull");
        navigate('/sign-in');
      }
    } catch (error) {
      toast.error("Something went wrong");
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Anurag
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        {/* right */}
       
        <div className='flex-1'>
        <Tab tabData={tabData} field={accountType} setField={setAccountType} />
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div className='relative'>
              <Label value='Your password' />
              <TextInput
                type={showPassword?("text"):("password")}
                placeholder='Password'
                id='password'
                onChange={handleChange}
              />
              <span  
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="w-[15px] cursor-pointer absolute right-4 top-[44px] transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                        ) : (
                          <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                        )}
                </span>
            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <OAuth   accountType={accountType}/>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>          
              <Link to='/sign-in' className='text-blue-500'>
              Sign In
              </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
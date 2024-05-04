import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { toast } from "react-hot-toast"
import{  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error} = useSelector((state) => state.user);
  const [showPassword,setShowPassword]=useState(false);
 // console.log(error);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  useEffect(()=>{
    dispatch(signInFailure(null));
  },[])
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
         toast.error("Something went wrong");

      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        toast.success("Sign-in successfull");
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error("Something went wrong");
    }
  };
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Article
            </span>
            App
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can sign in with your email and password
            or with Google.
          </p>
        </div>
        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <Label value='Your password' />
              <TextInput
                type={showPassword?("text"):("password")}
                placeholder='**********'
                id='password'
                onChange={handleChange}
              />
              <span 
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="w-[15px] cursor-pointer absolute right-3 top-[44px] transform -translate-y-1/2"
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
                'Sign In'
              )}
            </Button>
            <OAuth/>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Dont Have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>
              Sign Up
            </Link>
            <Link to='/forgot-password'>
              <p className='ml-10'>
                Forgot Password
              </p>
            </Link>
          </div>
          {error && (
            <Alert className='mt-5' color='failure'>
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
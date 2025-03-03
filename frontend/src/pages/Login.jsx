import React from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import AuthImagePattern from '../components/AuthImagePattern'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

function Login() {

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const { login, isLoggingIn } = useAuthStore()

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required")
    if (!/\S+@\S+.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password.trim()) return toast.error("Password is required")
    if (formData.password.length < 6) return toast.error("Password must be atleast 6 characters")

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const success = validateForm()
    if (success === true) {
      login(formData)
    }
  }


  return (
    <>
      {/* Left Side */}
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen grid lg:grid-cols-2">
        <div className="flex flex-col items-center justify-center p-6 sm:p-12 mt-12">

          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col items-center mt-12">
              <img
                src="/login.png"
                alt="Logo"
                className="w-24 h-12 sm:w-28 sm:h-14 md:w-32 md:h-20 lg:w-36 lg:h-24 object-contain"
              />
            </div>


            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>


                <div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="you@example.com"
                    required=""
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />

                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-gray-500" />
                    ) : (
                      <Eye className="size-5 text-gray-500" />
                    )}
                  </button>
                </div>

                <button
                  className="relative w-full inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
                  disabled={isLoggingIn}
                >
                  <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </span>
                </button>
                <p className="text-sm font-light text-white text-center">
                  Don't have an account?
                  <Link to="/signup" className="font-medium  hover:underline  text-blue-600 dark:text-sky-400">
                    {" "}Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>

        </div>

        {/* Right Side */}
        <AuthImagePattern
          title="Join our community"
          subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
        />

      </div>
    </>
  )
}

export default Login

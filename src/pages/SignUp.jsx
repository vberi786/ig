import {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {auth} from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import {db} from "../firebase";
import {doc, getDoc,setDoc } from "firebase/firestore";

const SignUp = () => {
  const [err,setError]=useState("")
  const navigate=useNavigate();

  const handleSubmitSignUp=async(e)=>{
    e.preventDefault()
    let username=e.target[0].value;
    let email=e.target[1].value;
    let password=e.target[2].value;

    // Check for username already exists
    const docRef = doc(db, "usernames", username);
    try {
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) {
          alert("Username already exist ! Please choose another username");
          return;
      }

    } catch(error) {
        console.log(error)
    }


    try{

      let userCredential= await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;

      setDoc(doc(db, "usernames",username), {
        username:username,
        email:email
      });

      try{
        await updateProfile(user, {
          displayName: username
        })
        console.log("Display name updated");
      }catch(err)
      {
        console.log("Error in display name updation",err.message);
      }

      e.target[0].value=""
      e.target[1].value=""
      e.target[2].value=""
      navigate("/"); //Success

    }catch(error)
    {
      setError(error.message);
      setTimeout(()=>{
        setError("");
      },2000)
    }

  

  }
  
  return (
    <div className="form_container">

    <div className="inner_form_box">

      <div>
        <center>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png?20160616034027" height={70} alt="" />
        </center>
      </div>

      <form onSubmit={handleSubmitSignUp}>
        <center>
          <input type="text" placeholder='username'/>
          <input type="email" placeholder='Email'/>
          <input type="password" placeholder='Password' />
          <button className="btn">Sign Up</button>
          </center>
        </form>
    </div>

        <div className='signup_login'>
          <center>
            <p>Have an account ?  <Link to="/login"><b>Log in</b></Link></p>
            <p>{err&&err}</p>           
          </center>
        </div>
    </div>
  )
}

export default SignUp;
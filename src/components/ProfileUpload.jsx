import { AuthContext } from '../context/AuthContext';
import { useState, useContext } from 'react';
import { Avatar,Box,Button,Modal } from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {doc,updateDoc} from "firebase/firestore";
import { updateProfile } from 'firebase/auth';
import {db, storage} from "../firebase";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 360,
  bgcolor: 'background.paper',
  border: '1px solid grey',
  borderRadius:'.5rem',
  boxShadow: 24,
  p: 4,
};

export default function ProfileUpload() {
  const {currentUser}=useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [image,setImage]=useState(null);
  const [loading,setLoading]=useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);   

  const handleUploadPost= (e)=>{
    
    e.preventDefault();
    if(image===null)return;

    setLoading(true);
    
    const storageRef = ref(storage, `profileImages/${image.name}`)
    const uploadTask=uploadBytesResumable(storageRef,image);

    uploadTask.on("state_changed",null,
        (error)=>{
        alert("Error on profile upload ",error.message);
        handleClose();
        setLoading(false);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref)
          .then(async(url)=>{
        
            try{
                await updateProfile(currentUser, {
                photoURL: url
                })//Update in user photoURL object 

                updateDoc(doc(db, "usernames",currentUser.displayName), {
                  profilePic:url
                });

                // console.log("Profile pic updated");
            }catch(err)
            {
                console.log("Error in profile pic upload",err.message);
            }
  
            setImage(null);
            handleClose();
            setLoading(false);
      })
    })
  
      
  }


  return (
    <div>
      <Button onClick={handleOpen}>
        <Avatar className='post_avatar'
                alt={currentUser.displayName}
                src={currentUser.photoURL} />
      </Button>
      
      
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {
            loading?<div>
            <h1 className='screen-center'>Loading ....</h1>

            </div>:<div>

            <h2 className='center'>Upload Profile</h2>
            <form>
                <input className='w100' type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                <button className='btn w100' onClick={handleUploadPost}>Upload</button>
            </form>
          
          </div>
         }  
        </Box>
      </Modal>
    </div>
  );
}

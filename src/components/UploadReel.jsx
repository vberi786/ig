import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {Box,Button,Modal} from '@mui/material';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {doc,setDoc,serverTimestamp} from "firebase/firestore";
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

export default function BasicModal() {
  const {currentUser,uid}=useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [caption,setCaption]= useState("")
  const [video,setVideo]=useState(null);
  const [loading,setLoading]=useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUploadPost=async(e)=>{
    e.preventDefault();
    if(caption===""||video===null)return;
    
    setLoading(true);
    const storageRef = ref(storage, `reels/${video.name}`)
    const uploadTask=uploadBytesResumable(storageRef,video);

    uploadTask.on("state_changed",null, (error)=>{
      alert(error.message);
      handleClose();
      setLoading(false);
    },
    ()=>{
      //Complete
      getDownloadURL(uploadTask.snapshot.ref)
      .then((url)=>{
        
        setDoc(doc(db, "reels",uid()), {
          timestamp:serverTimestamp(),
          videoUrl:url,
          caption:caption,
          username: currentUser.displayName,
          like:[]
        });

        setCaption("");
        setVideo(null);
        handleClose();
        setLoading(false);
      })
      
    })

  
      
  }

  return (
    <div>
      <Button onClick={handleOpen}>
        <DriveFolderUploadIcon sx={{ fontSize: 40, color:"white" }}/>
      </Button>
      
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {
            loading?<div>
            <h1 className='screen-center'>Loading ....</h1>
            </div>:<div>
          <h2 className='center'>Upload new reel</h2>
          <form>
            <input  className='w100' type="text" placeholder='Caption' onChange={(e)=>setCaption(e.target.value)}/>
            <input className='w100' type="file" onChange={(e)=>setVideo(e.target.files[0])}/>
            <button className='btn w100' onClick={handleUploadPost}>Upload</button>
          </form>
          
          </div>
         }  
        </Box>
      </Modal>
    </div>
  );
}

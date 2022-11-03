import React from 'react';

const Comment = ({username,comment}) => {
  return (<>
    {
        comment&&comment.map((val,index)=>{
            return <div className="comment" key={index}>
                <h4 className='post_text'><strong>{username}</strong> {val}</h4>
            </div>
        })
    }    
    </>
  )
}

export default Comment;
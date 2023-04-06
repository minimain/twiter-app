import React, { useEffect, useState } from 'react'
import { doc, deleteDoc, updateDoc} from "firebase/firestore";
import { db, storage } from 'fbase';
import {  ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import'styles/tweet.scss';

function Tweet(props) {
  // console.log('tweetObj ->', tweetObj);
  console.log('props->', props);
  const {tweetObj:{createdAt,creatorId,text, id, attachmentUrl},isOwner} = props;
  // createdAt 으로 바꿔줌 원래 createAt이었음
  //  const {tweetObj:
  //   {createAt,creatorId,text, id}}
  //   ,isOwner} = props;
  const [editing, setEditing] = useState(false);
  const [newTweet,setNewTweet] = useState(text);
  const [nowDate, setNowDate] =useState(createdAt);

  const onDeleteClick = async () => { 
    const ok = window.confirm("삭제하시겠습니까?");
    if(ok) {
      const data = await deleteDoc(doc(db, "tweets", `/${id}`));
      if(attachmentUrl !== ""){
        const desertRef = ref(storage, attachmentUrl);
       await deleteObject(desertRef);
      }
    }
   }

   const toggleEditing = () => setEditing((prev) => !prev); //토글기능

   const onChange = (e) =>{
    const {target:{value}} = e;
    setNewTweet(value);
   }

   const onSubmit = async (e) =>{
    e.preventDefault();
    const newTweetRef = doc(db, "tweets", `/${id}`);

    // Set the "capital" field of the city 'DC'
    await updateDoc(newTweetRef, {
      text: newTweet,
      createAt: Date.now(),
    });
    setEditing(false);
   }

   useEffect(() => {
   let timeStamp = createdAt; //createdAt 이래.. 근데 난 없는뎅..
  //  나우는 밀리세컨드 계산해주느것 그것을 toUTCString() 를 사용하면 
  const now = new Date(timeStamp);
  setNowDate(now.toDateString());//.toUTCSrting() .toDateString()
   }, [])


  return (
    <div className='tweet'>
     {editing ? (
     <>
     <form onSubmit={onSubmit} className='container tweetEdit'>
      <input type='text' onChange={onChange} value={newTweet} required className='formInput'/>
      <input type='submit' value='Update Tweet' className='formBtn'/>
     </form>

     <button onClick={toggleEditing} className='formBtn cancelBtn'>Cancel</button>
     </>
     ) : (
      <>
       <h4>{text}</h4>
       {attachmentUrl && (
        <img src={attachmentUrl} width="50" height="50" alt="" />
       )}
       <span>{nowDate}</span>
        {isOwner && (
        <div className='tweet__acticons'>
        <span onClick={onDeleteClick}><FontAwesomeIcon icon="fa-solid fa-trash" /></span>
        <span onClick={toggleEditing}><FontAwesomeIcon icon="fa-solid fa-pencil" /></span>
        </div>
        )}
      </>
     )}

    </div>
  )
}

export default Tweet
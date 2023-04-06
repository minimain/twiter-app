import React, { useState } from 'react'
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from 'fbase';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import'styles/tweetinsert.scss';

function Tweetinsert({userObj}) {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState(""); //("문자열인 이미지 주소")첨부파일 값이 있으면 트루


  const onSubmit = async (e) => {
    e.preventDefault();
    try {
     let attachmentUrl = "";
     if(attachment !== ""){
      const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(storageRef, attachment, 'data_url');
      console.log('responser->',response);
      attachmentUrl = await getDownloadURL(ref(storage, response.ref)); //http://
     }
      const docRef = await addDoc(collection(db, "tweets"), {
        text: tweet,
        createdAt: Date.now(),  //밀리세컨드로 현재 시간 알려줌
        creatorId: userObj.uid,  //이 문서를 누가 작성했는지 알아야함
        attachmentUrl
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setTweet("");
    setAttachment("");
  };

  const onFilechage = (e) => {
    console.log(e);
    const {target:{files}} = e;
    const theFile = files[0];
    console.log(theFile); //jpg

    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent);
      const {currentTarget:{result}} = finishedEvent; //data:image
      setAttachment(result);
    }
    reader.readAsDataURL(theFile);
  }

  const onclearAttachment = () => {
  setAttachment("");
  }


  const onChange = e =>{
    e.preventDefault();
    const {target: {value}} = e;
    setTweet(value);
  }


  return (
   <>
   <form onSubmit={onSubmit} className='InsertForm'>
    <div className='InsertInput__container'>
    <input type="text" value={tweet} placeholder="'What's on your mind" onChange={onChange} maxLength={120} className='InsertInput__input'/>
    <input type='submit' name='submit' value='&rarr;' className='InsertInput__arrow'/>
    </div>
    <label htmlFor="attach-file" className='InsertInput__label'>  
    <span>Add photo</span>
    <FontAwesomeIcon icon="fa-solid fa-plus" />
    </label>
    <input type='file' accept='image/*' onChange={onFilechage} id='attach-file' style={{opacity:0}} />
  
  {/* 이미지 미리보기 */}
    {attachment && (
      <div className='Insertform__attachment'>
        <img src={attachment} style={{backgroundImage:attachment}} alt=""/>
        <div className='Insertform__clear' onClick={onclearAttachment}>
          <span>Remove</span>
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
        </div>
      </div>
    )}
   </form>
   </>
  )
}

export default Tweetinsert
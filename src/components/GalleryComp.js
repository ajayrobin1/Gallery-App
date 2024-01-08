import React from 'react';
import { Link } from 'react-router-dom';
import {db} from "../firebase";
import {useState, useEffect} from "react";
import {
  collection, 
  query, 
  onSnapshot, 
  where, 
  limit,
  orderBy,
  startAfter
 } from "firebase/firestore";
import LoadingScreen from '../components/LoadingScreen';
import { ImageList, ImageListItem, useTheme ,CssBaseline, Box } from '@mui/material';
import { useMediaQuery } from '@material-ui/core'
import { useAuth } from "../AuthContext"
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@mui/material/CircularProgress';


const GalleryComp = (props) => {
  const [files, setFiles] = useState([]);
  const [lastVisible, setLastVisible] = useState();
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const nsfwStatus = localStorage.getItem('safety');

  const INITIAL_LIMIT = 10;

  const theme = useTheme();
  const { currentUser } = useAuth()
  const matchDownMd = useMediaQuery(theme.breakpoints.down('sm'))

  function fetchMoreData(){
    setHasMore(true)
    function getNextQuery(){ 
      if(props.content === "popular") {
        return (nsfwStatus!=='hide')?
        query(collection(db, "files") 
        ,limit(3)
        ,orderBy("views", "desc")
        ,startAfter(lastVisible)

        )
        :query(collection(db, "files"), 
        where("nsfw","==", false),
        limit(3)
        ,orderBy("views", "desc")
        ,startAfter(lastVisible)
        )
      } else if (props.content === "latest"){
        return (nsfwStatus!=='hide')?
        query(collection(db, "files") 
        ,orderBy("uploadedOn", "desc")
        ,startAfter(lastVisible)
        ,limit(3)
        )
        :query(collection(db, "files"), where("nsfw","==", false) 
        ,orderBy("uploadedOn", "desc")
        ,startAfter(lastVisible)
        ,limit(3)
        )
      }
      else if (props.content === "collection" && currentUser) {
    
          if(nsfwStatus!=='hide'){
        return query(collection(db, "files"), 
        where("likedBy","array-contains", currentUser.uid)
        ,orderBy("views", "desc")
        ,limit(3)
        ,startAfter(lastVisible)
        )} else {
          return query(collection(db, "files"), 
          where("likedBy","array-contains", currentUser.uid)
          ,where("nsfw","==", false)
          ,orderBy("views", "desc")
          ,limit(3)
          ,startAfter(lastVisible)
          )
        }
}
}

if(hasMore){
  const q = getNextQuery();
  onSnapshot(q, (querySnapshot)  => {
    setLoading(true)
    const newList = querySnapshot.docs.map(doc =>({
      id: doc.id,
      imgUrl: doc.data().imgUrl,
      nsfw: doc.data().nsfw
    }))
    setFiles(files.concat(newList))

    setLoading(false)
    setLastVisible(querySnapshot.docs.at(-1))
    if(querySnapshot.docs<3) {
      setHasMore(false)
    }
})
}
}
  
  useEffect( () => { 
       function getFirstQuery(){ 
        if(props.content === "popular") {
          return (nsfwStatus!=='hide')?
          query(collection(db, "files") 
          ,limit(INITIAL_LIMIT) //change to 15 before hosting
          ,orderBy("views", "desc")
          )
          :query(collection(db, "files"), where("nsfw","==", false) 
          ,limit(INITIAL_LIMIT) //change to 15 before hosting
          ,orderBy("views", "desc")
          )
        } else if (props.content === "latest"){
          return (nsfwStatus!=='hide')?
          query(collection(db, "files") 
          ,orderBy("uploadedOn", "desc")
          ,limit(INITIAL_LIMIT)
          )
          :query(collection(db, "files"), where("nsfw","==", false) 
          ,orderBy("uploadedOn", "desc")
          ,limit(INITIAL_LIMIT)
          )
        } else if (props.content === "collection" && currentUser) {
          return (nsfwStatus!=='hide')?
          query(collection(db, "files") ,
          where("likedBy","array-contains", currentUser.uid)
          ,orderBy("uploadedOn", "desc")
          ,limit(INITIAL_LIMIT)
          )
          :query(collection(db, "files"), where("nsfw","==", false)
          ,where("likedBy","array-contains", currentUser.uid)
          ,orderBy("uploadedOn", "desc")
          ,limit(INITIAL_LIMIT)
          )
        }
  }

  const q = getFirstQuery();
    onSnapshot(q, (querySnapshot)  => {
      setLoading(true)
      setFiles(querySnapshot.docs.map(doc =>({
        id: doc.id,
        imgUrl: doc.data().imgUrl,
        nsfw: doc.data().nsfw
      }))
      )
      setLoading(false)
      setLastVisible(querySnapshot.docs.at(-1))
  })

},[
  props.content, 
  currentUser,
  nsfwStatus,
])

  return (
    <>
    <CssBaseline/>
    {
    loading
    ?<LoadingScreen/>
    :
      <InfiniteScroll
      className='hideScroll'
      dataLength={files.length} //This is important field to render the next data
      next={fetchMoreData}
      hasMore={hasMore}
      loader={
        <Box sx={{ display: 'flex', justifyContent:'center', py:2 }}>
          <CircularProgress />
        </Box>
      }
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>You have seen it all</b>
        </p>
      }
      >
  <ImageList
    variant="quilted"
    sx={{m:0}}
    cols={(matchDownMd || (props.content ==="browse"))? 3 : 4 }
   >
      {files.map((item) => (
        (props.id !== item.id) &&
        <ImageListItem 
        sx={{
          overflow: 'hidden'}} 
          key={item.id} component={Link} to={`/gallery/${item.id}`}>
            <img
               srcSet={`${item.imgUrl}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
               src={`${item.imgUrl}?w=164&h=164&fit=crop&auto=format`}
               alt={item.title}
               style={{overflow: 'hidden', m:'-1px', p:'1px', 
               filter:(item.nsfw && (localStorage.getItem('safety')==='blur'))? 'blur(10px)': 'none'
              }}
              height="194"
              />
            </ImageListItem>
      ))}

    </ImageList>
    </InfiniteScroll>
      }
    </>
  );

};

export default GalleryComp;

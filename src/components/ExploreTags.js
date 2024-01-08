import React, { useState, useEffect } from "react"
import { 
  collection, 
  startAfter,
  limit,
  where, 

  query, onSnapshot
  } from "firebase/firestore"; 
  import { ImageList, ImageListItem, useTheme ,CssBaseline, Box, Autocomplete, TextField, InputAdornment, Typography } from '@mui/material';
import {db} from "../firebase"
import {Alert, Fade } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@material-ui/core'
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@mui/material/CircularProgress';
  

const ExploreTags = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('sm'))

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [alertVisibility, setAlertVisibility] = useState(false);
  const [lastVisible, setLastVisible] = useState();
  const [hasMore, setHasMore] = useState(true);

  let search = window.location.search;
  let params = new URLSearchParams(search);

  const [keyword, setKeyword] = useState(params.get('q') || '');
  const [browseTag, setBrowseTag] = useState( null);
  const [files, setFiles] = useState([]);
  const nsfwStatus = localStorage.getItem('safety');
  console.log(loading)

  function fetchMoreData(){
    function getNextQuery(){ 
          if(nsfwStatus!=='hide'){
        return query(collection(db, "files")
        ,where("tags","array-contains", browseTag)
        ,limit(4)
        ,startAfter(lastVisible)
        )} else {
          return query(collection(db, "files")
        ,where("tags","array-contains", browseTag)
          ,where("nsfw","==", false)
          ,limit(4)
          ,startAfter(lastVisible)
          )       
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
    if(querySnapshot.docs<4) {
      setHasMore(false)
    }
})
}
}

  useEffect(  () => { 
    setLoading(true)
    if(keyword){
        const q =query(collection(db, "tags"), 
        where('name', '>=', 
        keyword[0].toUpperCase() + keyword.substring(1)
        )
        ,limit(6)
        ) 

        onSnapshot(q, (querySnapshot)  => {
          const tagList = querySnapshot.docs.map(doc =>({
            id: doc.id,
            name: doc.data().name
          }))
          setTagList(tagList)
         
          setBrowseTag(tagList[0])
          
            })

      setLoading(false)
    }

      },
      [keyword])


      useEffect(  () => { 
        setLoading(true)
        function getQuery(){
        if(nsfwStatus!=='hide'){
        return query(collection(db, "files"), 
          where("tags","array-contains", browseTag)
          ,limit(4)
          ) 
        } else {
        return query(collection(db, "files"), 
            where("tags","array-contains", browseTag)
            ,where("nsfw","==", false)
            ,limit(4)
        )
          }
        }
        const q = getQuery();
        
        onSnapshot(q, (querySnapshot)  => {
          setLoading(true)
          setFiles (querySnapshot.docs.map(doc =>({
            id: doc.id,
            imgUrl: doc.data().imgUrl,
            nsfw: doc.data().nsfw
          })))

      setLastVisible(querySnapshot.docs.at(-1))
          setLoading(false)
          if(querySnapshot.docs<4) {
            setHasMore(false)
          } else setHasMore(true)

        })
          
        }, [browseTag, nsfwStatus])

  return (
    <>
    
          {error && <Fade
          in={alertVisibility} //Write the needed condition here to make it appear
          addEndListener={() => {
            setTimeout(() => {
              setAlertVisibility(false)
              setError(null)
            }, 2000);
          }}
          >
      <Alert severity="error">{error}</Alert>
      </Fade>}

      {message && <Fade
          in={alertVisibility} //Write the needed condition here to make it appear
          addEndListener={() => {
            setTimeout(() => {
              setAlertVisibility(false)
              setMessage(null)
            }, 2000);
          }}
          >
      <Alert severity="success">{message}</Alert>
      </Fade>}

        <CssBaseline />
    
            <Autocomplete
              fullWidth
              id="combo-box-demo"
              onChange={(event, value) => {setBrowseTag(value)
                if(value){
                navigate(`?tab=2&q=${value.name}`)
                }
              }}

              options={tagList? tagList :[]}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => 
              <TextField 
                placeholder="Search tags...."
                onChange={(e)=>{
                  setKeyword(e.target.value)
                }}
              {...params} 
              
              InputProps={{
                
                ...params.InputProps,
                style: {
                  paddingLeft: 5
                },
                 endAdornment: (
                  <InputAdornment position='end'>
                  
                   <SearchIcon fontSize="large"/>
                
                    </InputAdornment>
                 )
              }}
              />}
            />

{(!browseTag)?
<Typography sx={{p:2, m:'auto'}}>
  Search to load results.
</Typography>

          :<Box sx={{py:2}}>
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
    cols={matchDownMd? 3 : 4 }
   >
      {files.map((item) => (
     
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
    </Box>
}
</>
  )
};

export default ExploreTags;
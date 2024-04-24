import React,{createContext, useState, useEffect} from 'react';

//context
const postcontext = createContext();

//provider
const Postprovider= ({children})=> {
    //global state
    const[loading, setloading] = useState(false);
    const [posts, setposts] = useState([]);

    //get all posts
    const getallposts = async() => {
        try {
            const response = await fetch("http://192.168.0.104:8080/api/v1/post/getallposts", {
                method : "GET",
                headers : {
                    'Content-type' : 'application/json',
                }
            });
            setloading(false);
            const result = await response.json();
            setposts(result.allposts);
            
        } catch (error) {
            console.log(error);
            setloading(false);
        }
    };

    //initial posts
    useEffect(()=>{ getallposts() }, []);

    return(
        <postcontext.Provider value={[posts, setposts, getallposts]}>
            {children}
        </postcontext.Provider>
    )
};

export {postcontext, Postprovider};
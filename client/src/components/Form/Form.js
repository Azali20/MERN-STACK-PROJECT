import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useHistory } from 'react-router-dom';
import { createPost, updatePost } from '../../actions/posts';
import useStyles from './styles';

const Form = ({ currentId, setCurrentId }) => {
    const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: '' });
    const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const history = useHistory();

    const clear = useCallback(() => {
        setCurrentId(0);
        setPostData({ title: '', message: '', tags: [], selectedFile: '' });
    }, [setCurrentId]);

    useEffect(() => {
        if (!post?.title) clear();
        if (post) setPostData(post);
    }, [post, clear]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tagArray = postData.tags.map(tag => tag.trim()); // This will remove leading/trailing spaces
        const cleanedTags = tagArray.filter(tag => tag !== ''); // This will remove empty tags

        if (currentId === 0) {
        dispatch(createPost({ ...postData, tags: cleanedTags, name: user?.result?.name }, history));
        clear();
        } else {
        dispatch(updatePost(currentId, { ...postData, tags: cleanedTags, name: user?.result?.name }));
        clear();
        }
    };

    if (!user?.result?.name) {
        return (
        <Paper className={classes.paper} elevation={6}>
            <Typography variant="h6" align="center">
            Please Sign In to create your own memories and like other's memories.
            </Typography>
        </Paper>
        );
    }

    const handleTagsChange = (event) => {
        setPostData({ ...postData, tags: event.target.value.split(',') });
    };

    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">{currentId ? `Editing "${post?.title}"` : 'Creating a Memory'}</Typography>
                <TextField 
                    name="title" 
                    variant="outlined" 
                    label="Title" 
                    fullWidth 
                    value={postData.title} 
                    onChange={(e) => setPostData({ ...postData, title: e.target.value })} />

                <TextField 
                    name="message" 
                    variant="outlined" 
                    label="Message" 
                    fullWidth 
                    multiline 
                    minRows={4} 
                    value={postData.message} 
                    onChange={(e) => setPostData({ ...postData, message: e.target.value })} />

            <div style={{ padding: '5px 0', width: '94%' }}>
                <TextField 
                    name="tags" 
                    label="Tags"
                    variant="outlined" 
                    fullWidth 
                    value={postData.tags.join(',')} 
                    onChange={handleTagsChange} />
            </div>
            <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>
            <Button className={classes.buttonSubmit} 
                variant="contained" 
                color="primary" 
                size="large" 
                type="submit" 
                fullWidth>Submit</Button>
            <Button 
                variant="contained" 
                color="secondary" 
                size="small" 
                onClick={clear} fullWidth>Clear
            </Button>
        </form>
        </Paper>
    );
};

export default Form;
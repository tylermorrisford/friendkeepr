import React, {useState, useEffect, useContext, useCallback} from 'react'
import FriendForm from './FriendForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {UserContext} from '../context/UserContextProvider'

export default function FriendsTable() {

    const {userId} = useContext(UserContext)
    
    const [friends, setFriends] = useState([])
    const [editing, setEditing] = useState(false)
    const [editFriend, setEditFriend] = useState({})
    
    const getAllFriends = useCallback( () => {
            fetch('/api/all_friends')
                .then((response) => response.json())
                .then((data) => {
                    console.log('data object', data);
                    console.log(data.data);
                    console.log(typeof(data.data));
                    setFriends(data.data)
                })
                .catch(err => console.log('ERROR: ', err))
            }
    ) 

    // effect to get all friends on load
    useEffect(() => {
        if (friends.length === 0) {getAllFriends()}
    }, [getAllFriends])

    // can remove this...
    useEffect(() => console.log('friends:',friends, '& userId', userId), [friends])

    // Delete a friend (sad!)
    const deleteFriend = async (friendId) => {
        let response = await fetch("/api/delete_friend", {
            method: 'POST',
            body: JSON.stringify({
                friend_id: friendId,
            }),
            headers:{          
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                }
        })
        let data = await response.json()
        if (response.status !== 200) {throw Error}
        console.log('response data', data)
        if (data.data === 1) { // if delete is successful, getallfriends(update data)
            getAllFriends()
        }   
    }

    const handleEditFriend = (theFriend) => {
        console.log('editing!')
        let friendEdit = {
            id: theFriend.id,
            name: theFriend.friend_name,
            note: theFriend.friend_note,
            known: theFriend.known_years
        }
        setEditFriend(friendEdit)
        setEditing(true)
    }

    const clearEditFriend = () => {
        setEditing(false)
        setEditFriend({})
    }


    return(
        <div className="column">
        <FriendForm 
            getAllFriends={getAllFriends}
            editFriend={editFriend}
            editing={editing}
            clearEditFriend={clearEditFriend}
        />
        <hr/>
        <h2>hi friends!</h2>
        <br/>
                <table className="table is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <td><strong>Name</strong></td>
                            <td><strong>Note</strong></td>
                            <td><strong>Known for</strong></td>
                            <td><strong>Edit Info</strong></td>
                            <td><strong>Delete</strong></td>
                        </tr>
                    </thead>
                    <tbody>
                        {friends.length > 0 && friends.map(friend => {
                            return <tr key={friend.id}>
                                <td>{friend.friend_name}</td>
                                <td>{friend.friend_note}</td>
                                <td>{friend.known_years} years</td>
                                <td><FontAwesomeIcon icon={faUserEdit}
                                    style={{cursor: 'pointer'}} 
                                    onClick={() => {handleEditFriend(friend)}}/></td>
                                <td><FontAwesomeIcon icon={faTrashAlt}
                                    style={{cursor: 'pointer'}} 
                                    onClick={() => {deleteFriend(friend.id)}}/></td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <div className="card is-hoverable">
  <div className="card-content">
    <p className="title">
      “There are two hard things in computer science: cache invalidation, naming things, and off-by-one errors.”
    </p>
    <p className="subtitle">
      Jeff Atwood
    </p>
  </div>
</div>
            </div>
    )
}
import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
]


function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>{children}</button>
  )
}

export default function App() {
  const [addFormStatus, setAddFormStatus] = useState(false)
  const [friends, setFriends] = useState([...initialFriends])
  const [selected, setSelected] = useState('')

  function onAdd() {
    setAddFormStatus(show => !show)
  }

  function handleAddFriend(friend) {
    setFriends(friends => [...friends, friend])
    setAddFormStatus(false)
  }

  function handleSelection(friend) {
    setSelected(cur => cur?.id === friend.id ? null : friend)
    setAddFormStatus(false)
  }

  function handleSplitBill(value) {
    console.log(value);
    setFriends(friends => friends.map(friend => friend.id === selected.id ? { ...friend, balance: friend.balance + value } : friend))
    setSelected(null)
  }


  return (
    <div className="app">
      <div className="sidebar">

        <FriendsList friends={friends} selected={selected} onSelect={handleSelection} />

        {addFormStatus ?
          <>
            <AddFriend friends={friends} setFriends={setFriends} handleAddFriend={handleAddFriend} />
            <Button onClick={onAdd}>Close</Button>
          </>
          :
          <Button onClick={onAdd}>Add Friend</Button>
        }
      </div>
      {selected && <SplitForm selected={selected} onSplit={handleSplitBill} />}
    </div>
  )
}

function FriendsList({ friends, selected, onSelect, }) {
  // const [initialFriends, setInitialFriends] = useState([])
  // const friends = initialFriends
  return (<ul>
    {friends.map(friend =>
      <Friend friend={friend} selected={selected} onSelect={onSelect} key={friend.id} />
    )}
  </ul>)
}

function Friend({ friend, selected, onSelect, }) {

  const isSelected = selected?.id === friend.id

  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={`pfp of ${friend.name}`} />
      <h3>{friend.name}</h3>

      {friend.balance > 0 ?
        <p className="green">
          {friend.name} owes you ${friend.balance}
        </p>
        : friend.balance < 0 ?
          <p className="red">
            you owe {friend.name} ${Math.abs(friend.balance)}
          </p>
          :
          <p>you and {friend.name} are even </p>}

      <Button onClick={() => onSelect(friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>

    </li>
  )
}


function SplitForm({ selected, onSplit }) {
  const [bill, setBill] = useState('')
  const [paidByUser, setPaidByUser] = useState('')
  const friendExp = bill ? bill - paidByUser : ''
  const [whoIsPaying, setWhoIsPaying] = useState('user')
  const name = selected.name

  function handleSubmit(e) {
    e.preventDefault()

    if (!bill || !paidByUser) return

    onSplit(whoIsPaying === 'user' ? friendExp : -paidByUser)
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>

      <h2>Share a bill with {name}</h2>

      <label htmlFor="bill">💰Bill Value</label>
      <input type="number" name="bill" value={bill} onChange={(e) => setBill(Number(e.target.value))}></input>

      <label htmlFor="yourExp">🧍‍♂️Your Expense</label>
      <input type="number" name="yourExp" value={paidByUser}
        onChange={(e) =>
          setPaidByUser(Number(e.target.value) > bill
            ?
            paidByUser : Number(e.target.value))} />

      <label htmlFor="theirExp">🧑‍🤝‍🧑{name}'s Expense</label>
      <input type="number" name="theirExp" value={friendExp} disabled></input>

      <label htmlFor="billPaidBy">🤑Who paid the bill?</label>
      <select type="number" name="billPaidBy" value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
        <option value='user'>You</option>
        <option value='friend'>{name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  )
}

function AddFriend({ friends, handleAddFriend }) {
  const [name, setName] = useState('')
  const [image, setImg] = useState('https://i.pravatar.cc/48')

  function handleSubmit(e) {
    e.preventDefault();

    if (name === "") {
      return null
    }
    const id = crypto.randomUUID()
    const newFriend = {
      id, name,
      image: `${image}?=${id}`,
      balance: 0,
    }
    console.log(newFriend);
    setName('')
    setImg('https://i.pravatar.cc/48')
    handleAddFriend(newFriend)

    console.log(friends);

  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label htmlFor="friendName">🧑‍🤝‍🧑Friend Name</label>
      <input name="friendName" type='text' value={name} onChange={(e) => setName(e.target.value)} />

      <label htmlFor="imgUrl">🖼️Image URL</label>
      <input name="imgUrl" type='text' value={image} onChange={(e) => setImg(e.target.value)} />

      <Button>Add</Button>
    </form>
  )
}
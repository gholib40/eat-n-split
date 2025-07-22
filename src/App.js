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
];

const App = () => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const handleShowAddFriend = () => {
    setShowAddFriend((state) => !state);
  };
  const addFriends = (friends) => {
    setFriends((state) => [...state, friends]);
    setShowAddFriend(false);
  };

  const handleSelection = (friend) => {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  };

  const handleSplitBill = (value) => {
    setFriends((state) =>
      state.map((data) =>
        data.id === selectedFriend.id
          ? { ...data, balance: data.balance + value }
          : data
      )
    );
    setSelectedFriend(null);
  };

  return (
    <>
      <div className="app">
        <div className="sidebar">
          <FriendList
            friends={friends}
            onSelection={handleSelection}
            selectedFriend={selectedFriend}
          />
          {showAddFriend && <FormAddFriend onAddFriend={addFriends} />}

          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "Close" : "Add Friend"}
          </Button>
        </div>
        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
          />
        )}
      </div>
    </>
  );
};

const FriendList = ({ friends, onSelection, selectedFriend }) => {
  return (
    <>
      <ul>
        {friends.map((data) => {
          return (
            <Friend
              friend={data}
              key={data.id}
              onSelection={onSelection}
              selectedFriend={selectedFriend}
            />
          );
        })}
      </ul>
    </>
  );
};

const Friend = ({ friend, onSelection, selectedFriend }) => {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <>
      <li className={isSelected ? "selected" : ""}>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            you owe {friend.name} {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance > 0 && (
          <p className="green">
            you owe {friend.name} {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance === 0 && <p>you and {friend.name} are even</p>}
        <Button onClick={() => onSelection(friend)}>
          {isSelected ? "Close" : "Open"}
        </Button>
      </li>
    </>
  );
};

const Button = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
};

const FormAddFriend = ({ onAddFriend }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const id = crypto.randomUUID();
  const handleSubmit = (e) => {
    if (!name || !image) return;
    e.preventDefault();
    const newFriend = {
      name,
      image: `${image}? =${id}`,
      id,
      balance: 0,
    };
    setName("");
    setImage("https://i.pravatar.cc/48");
    onAddFriend(newFriend);
  };
  return (
    <form onSubmit={handleSubmit} className="form-add-friend">
      <label>👧Friend name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />
      <label>🗻 Image URL</label>
      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        type="text"
      />
      <Button>Add</Button>
    </form>
  );
};

const FormSplitBill = ({ selectedFriend, onSplitBill }) => {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paidByFriend = bill ? bill - paidByUser : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bill || !paidByUser) return null;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  };
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name} </h2>
      <label>💰Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>👦 Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>👩‍👦 {selectedFriend.name} </label>
      <input type="text" disabled value={paidByFriend} />
      <label>😄 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">you</option>
        <option value="friend">{selectedFriend.name} </option>
      </select>
      <Button>Add</Button>
    </form>
  );
};

export default App;

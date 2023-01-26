import styles from './style.module.css'
import {useState, useEffect, memo} from "react";
import Swal from "sweetalert2";

const bgImgs = ["url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2144&q=80')",
    "url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
    "url('https://images.unsplash.com/photo-1513407030348-c983a97b98d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80')"
]
let bgIndex = Math.floor(Math.random()*3);





function Clock(props) {
    console.log('clock rerendered');
    useEffect(() => {
        clock();
    }, [])
    const clock = () => {
        setInterval(() => {
            props.setTimes([new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()]);
            modDayTime();
        }, 1000);
    }
    const modDayTime = () => {
        if(0 <= props.times[0] && props.times[0] < 6){
            props.setDayTime("새벽");
        }
        else if(6 <= props.times[0] && props.times[0] < 12){
            props.setDayTime("아침");
        }
        else if(12 <= props.times[0] && props.times[0] < 18){
            props.setDayTime("오후");
        }
        else{
            props.setDayTime("밤");
        }
    }


    return(
        <div className={styles.clock}>
            {String(props.times[0]).padStart(2,'0')}:{String(props.times[1]).padStart(2,'0')}:{String(props.times[2]).padStart(2,'0')}
        </div>
    )
}
function LoginForm(props) {
    console.log('loginform rerendered');
    const [name, setName] = useState("");
    const onChange = (event) => {
        setName(event.target.value);
    }
    const loginSubmit = (event) => {
        if(name.length < 6){
            event.preventDefault();
            Swal.fire({icon:'success',title:'Welcome.',text:name});
            localStorage.setItem("username", name);
            props.setUsername(name);

        }

        else{
            event.preventDefault();
            Swal.fire({icon:'error',title:'Your name is too long.',text:"Try again within 5 characters."});
            setName("");
        }
    }
    return(
        <div className={styles.mainContainer}>
            <form onSubmit={loginSubmit}>
                <span className={styles.maintext}>좋은 {props.dayTime}입니다. </span>
                <input className={styles.maintextInput} type={"text"} value={name} onChange={onChange} placeholder={"Input your name"}></input>
            </form>
        </div>
    )
}
function AfterLogin(props) {
    console.log('afterlogin rerendered');
    const logout = () => {
        localStorage.removeItem("username");
        Swal.fire({
            title: 'Are you sure to log out?',
            text: "All of your data will be deleted.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF3434',
            cancelButtonColor: '#999',
            confirmButtonText: 'Yes, Log out'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Log out',
                    'Your data has been deleted.',
                    'success'
                )
                localStorage.setItem("lists", JSON.stringify([]));
                props.setUsername(null);
            }
        })
    }
    return(
        <div className={styles.mainContainer}>
            <div className={styles.maintext}>
                좋은 {props.dayTime}입니다. {props.username}
                <button className={styles.logoutBtn} onClick={logout}>Log out</button>
            </div>
        </div>
    )
}
function GithubMark() {
    console.log('github mark rerendered');
    return(
        <div className={styles.by}>
            by <a href={"https://github.com/minseoky/ToDoList-powered_by_react"} rel="noopener noreferrer" target="_blank">minseoky<img alt={"github mark"} className={styles.github} src="https://cdn-icons-png.flaticon.com/512/25/25231.png"></img></a>
        </div>
    )
}
function WeatherInfo() {
    const [weatherInfo, setWeatherInfo] = useState([]);// 0 : temp, 1 : weather, 2 : place, 3 : code, 4 : icon
    const [loading, setLoading] = useState(false);
    const getSuccess = (position) => {
        const APIKEY = 'cead9018524fcdd92d9c3b06baf01646';
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + APIKEY

        fetch(url).then((response) => response.json()).then((data) => {
            setWeatherInfo([Math.floor(data.main.temp-273.15),data.weather[0].main,data.name, data.weather[0].id, data.weather[0].icon]);
            setLoading(true);
        })
    }
    const WeatherIcon = () => {
        return(
            <div className={styles.weatherIcon}>
                <img src={"http://openweathermap.org/img/wn/"+ weatherInfo[4] +"@2x.png"} alt="weather_img"/>
            </div>
        )
    }
    const WeatherText = () => {
        return(
            <div className={styles.weatherText}>
                <div>
                    {weatherInfo[0]}°C
                </div>
                <div>
                    {weatherInfo[1]}
                </div>
                <div className={styles.weatherTextMini}>
                    {weatherInfo[2]}
                </div>
            </div>

        )
    }
    const LoadingText = () => {
        return(
            <div className={styles.loading}>
                Loading...
            </div>
        )
    }
    const getErr = () => {

    }
    //API
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(getSuccess,getErr);
    },[])



    return(
        <div className={styles.weatherBox}>

            {loading ? <WeatherText/> : <LoadingText/>}
            {loading ? <WeatherIcon code={weatherInfo[3]}/> : null}
        </div>
    )
}
function TodoList(){
    console.log('todolist rerendered');
    const [newlist, setNewlist] = useState("");
    const [lists, setLists] = useState(JSON.parse(localStorage.getItem("lists")));
    const [editIndex, seteditIndex] = useState(0);
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputvalue] = useState("");

    const onSubmit = (event) => {
        event.preventDefault();
        /* 새로운 목록과 checkbox check 상태를 리스트에 append */
        setLists((prev) => [...prev, [newlist, false]])
        setNewlist("");
    }
    useEffect(() => {
        localStorage.setItem("lists", JSON.stringify(lists));
    }, [lists])
    const onChange = (event) => {
        setNewlist(event.target.value);
    }
    const checkOnChange = (index, event) => {
        let tempArr = [...lists];
        tempArr[index][1] = !tempArr[index][1]; //set으로 바꿔야함
        setLists(tempArr);
        localStorage.setItem("lists", JSON.stringify(lists));
    }

    const delbtnOnClick = (index, e) => {
        Swal.fire({
            title: 'Are you sure to delete this?',
            text: "your list will be disappeared.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF3434',
            cancelButtonColor: '#999',
            confirmButtonText: 'Yes, delete it'
        }).then((result) => {
            if (result.isConfirmed) {
                let tempArr = [...lists];
                tempArr.splice(index, 1);
                setLists(tempArr);
                localStorage.setItem("lists", JSON.stringify(lists));
            }
        })
    }
    const editbtnOnClick = (index, e) => {
        setInputvalue(lists[index][0]); //선택한 todolist의 초기값 불러오기
        seteditIndex(index);
        setEditing(true);
    }

    const inputOnChange = (event) => {
        setInputvalue(event.target.value);
    }

    const donebtnOnClick = (index, e) => {
        let tempArr = [...lists];
        tempArr[index][0] = inputValue;
        setLists(tempArr);
        setInputvalue("");
        setEditing(false);
    }
    return(
        <div className={styles.todolist}>
            <p>To Do List</p>
            <div className={styles.todolistContainer}>
                <form onSubmit={onSubmit}>
                    <input type={"text"} className={styles.todolistInput} value={newlist} onChange={onChange} placeholder={"write your list"}/>
                    <ul className={lists.length <= 6 ? styles.innerList : styles.innerListOverflow}>
                        {lists.map((item,index) => {
                            return (
                                <div key={index}>
                                    <li className={item[1] ? styles.checked : styles.unchecked}>
                                        <div>
                                            <input
                                                type={"checkbox"}
                                                onChange={(e)=>{checkOnChange(index, e)}}
                                                checked={item[1]}
                                                className={styles.check}>
                                            </input>
                                            {editIndex === index && editing === true ?
                                                <input className={styles.editInput} type={"text"} onChange={inputOnChange} value={inputValue}></input>
                                                : item[0]
                                            }
                                            {editing === true ?
                                                null : <img alt={"delete"} className={styles.deleteBtn} onClick={(e) => delbtnOnClick(index,e)} src={"https://cdn-icons-png.flaticon.com/512/3334/3334328.png"}/>
                                            }
                                            {editIndex === index && editing === true ?
                                                <img alt={"done"} className={styles.doneBtn} onClick={(e) => donebtnOnClick(index,e)} src={"https://img.icons8.com/material-outlined/512/checked.png"}/>
                                                : <img alt={"edit"} className={styles.editBtn} onClick={(e) => editbtnOnClick(index,e)} src={"https://img.icons8.com/material-outlined/512/pencil.png"}/>
                                            }


                                        </div>
                                    </li>
                                </div>
                            )
                        })}
                    </ul>
                </form>
            </div>
        </div>
    )
}

function Quotes(){
    const [todaysQuote, setTodaysQuote] = useState("")
    const quotes = [
        [
            "The way to get started is to quit talking and begin doing.\n",
            "-Walt Disney-"
        ],
        [
            "Life is what happens when you're busy making other plans.\n",
            "-John Lennon-"
        ],
        [
            "Life is either a daring adventure or nothing at all.\n",
            "-Helen Keller-"
        ],
        [
            "To Travel is to Live\n",
            "-Hans Christian Andersen-"
        ],
        [
            "Only a life lived for others is a life worthwhile.\n",
            "-Albert Einstein-"
        ],
        [
            "You only live once, but if you do it right, once is enough.\n",
            "-Mae West-"
        ],
        [
            "Never go on trips with anyone you do not love.\n",
            "-Hemmingway-"
        ],
        [
            "We wander for distraction, but we travel for fulfilment.\n",
            "-Hilaire Belloc-"
        ],
        [
            "Travel expands the mind and fills the gap.\n",
            "-Sheda Savage-"
        ],
    ];
    useEffect(() => {
        setTodaysQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);
    console.log('aa');
    return(
        <div className={styles.quoteBox}>
            <div className={styles.quote}>
                {todaysQuote[0]}
            </div>
            <div className={styles.author}>
                {todaysQuote[1]}
            </div>
        </div>
    )
}
function ExceptClock(props){
    return(
        <div>
            <WeatherInfo/>
            <Quotes/>
            {props.username == null ?
                <LoginForm dayTime={props.dayTime} username={props.username} setUsername={props.setUsername}/> :
                <AfterLogin dayTime={props.dayTime} username={props.username} setUsername={props.setUsername}/>
            }
            {props.username == null ? null : <TodoList/>}
            <GithubMark/>
        </div>
    )
}
const NewExceptClock = memo(ExceptClock);
function App() {
    const [times, setTimes] = useState([new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()]);
    const [dayTime, setDayTime] = useState("");
    const [username, setUsername] = useState(null);

    useEffect(() => {
        if(localStorage.getItem("username") !== null){
            setUsername(localStorage.getItem("username"));
        }
        if(localStorage.getItem("lists") == null){
            localStorage.setItem("lists", JSON.stringify([]));
        }
    },[])
    return (
        <div
            className={styles.background}
            style={{backgroundImage: bgImgs[bgIndex]}}
        >
            <Clock times={times} setTimes={setTimes} dayTime={dayTime} setDayTime={setDayTime}/>
            <NewExceptClock dayTime={dayTime} username={username} setUsername={setUsername}/>
        </div>
    );
}

export default App;
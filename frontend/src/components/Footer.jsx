import { GrGithub } from "react-icons/gr"
import style from "./Footer.module.css"

const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.info}>
        &copy; {new Date().getFullYear()} by
        <a
          href="https://github.com/baehyunki/todo_list-express-react-sqlite"
          target="_blank"
          rel={"noreferrer"}
          style={{ display: "flex" }}
        >
          baehyunki
          <GrGithub />
        </a>
      </div>

      <span className={style.desc}></span>
    </footer>
  )
}

export default Footer

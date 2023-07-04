import "./deleteuserconfirm.css";

const DeleteUserConfirm = ({
  callback,
  t,
}: {
  callback: (res: boolean) => void;
  t: (text: string) => string;
}) => {
  return (
    <section className="deleteUser">
      <h2>{t("user_deleteConfirm")}</h2>
      <div className="deleteUser--buttonsBlock">
        <button onClick={() => callback(true)}>{t("user_deleteYes")}</button>
        <button onClick={() => callback(false)}>{t("user_deleteNo")}</button>
      </div>
    </section>
  );
};

export default DeleteUserConfirm;

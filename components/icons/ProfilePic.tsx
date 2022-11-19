export type ProfilePicProps = {
  userID: string;
  width?: number;
  height?: number;
};
export default function ProfilePic({ userID }: ProfilePicProps) {
  return (
    <div
      style={{
        backgroundColor: stringToColor(userID).substring(0, 7),
        borderRadius: "2px",
        border: "none",
        width: "100%",
        height: "100%",
        color: "white",
        fontSize: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    ></div>
  );
}

const stringToColor = (str: string) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var color = "#";
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substring(-2);
  }
  return color;
};

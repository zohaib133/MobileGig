import Images from "../../assets/images"

// can be doc, video, image
export const getImageSource = (url, options = {
  defaultImage: null,
  getUrlOnly: false,
}) => {

  if (typeof url == "string" && url.startsWith("https://")) {
    if (options.getUrlOnly) {
      return url
    }
    return { uri: url }
  }
  return (options.defaultImage || { uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png" })
}

export const refactorImageUrl = (url) => {
  if ((typeof (url) == "string") && (url.includes("http"))) {
    return "https" + url.split("http")[1]
  }
  return url
}
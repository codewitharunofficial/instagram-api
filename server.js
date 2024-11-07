import express from "express";
import axios from "axios";

const app = express();
const PORT = 8081;

app.post("/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const options = {
      method: "GET",
      url: "https://instagram210.p.rapidapi.com/ig_profile",
      params: {
        ig: username,
      },
      headers: {
        "x-rapidapi-key": "63082bf975mshaf2e4ae44199d66p180054jsne3e705022ef1",
        "x-rapidapi-host": "instagram210.p.rapidapi.com",
      },
    };

    try {
      const { data } = await axios.request(options);
      
      if (data) {
        const imageBuffer = await axios.get(data[0]?.profile_pic_url, {
          responseType: "arraybuffer",
        });
        const image_base64 = Buffer.from(imageBuffer.data, "binary").toString(
          "base64"
        );
        res.status(200).send({
          success: true,
          message: "User Fetched Successfully",
          user: {
            userName: data[0]?.username,
            fullName: data[0]?.full_name,
            profile_pic: `data:${imageBuffer.headers["content-type"]};base64,${image_base64}`,
            follower: data[0]?.follower_count,
            following: data[0]?.following_count,
            bio: data[0]?.biography,
            id: data[0]?.pk,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/stories/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const options = {
      method: "POST",
      url: "https://instagram120.p.rapidapi.com/api/instagram/stories",
      headers: {
        "x-rapidapi-key": "63082bf975mshaf2e4ae44199d66p180054jsne3e705022ef1",
        "x-rapidapi-host": "instagram120.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        username: username,
      },
    };

    try {
      const { data } = await axios.request(options);
      console.log("Stories:", data);
      res.status(200).send({
        success: true,
        message: "Stories Fetched Successfully",
        stories: data,
      });
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/highlights/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(500).send({
        success: false,
        message: "No User ID Provided",
      });
    } else {
      const options = {
        method: "GET",
        url: "https://instagram-scrapper-posts-reels-stories-downloader.p.rapidapi.com/highlights_by_user_id",
        params: {
          user_id: id,
        },
        headers: {
          "x-rapidapi-key":
            "63082bf975mshaf2e4ae44199d66p180054jsne3e705022ef1",
          "x-rapidapi-host":
            "instagram-scrapper-posts-reels-stories-downloader.p.rapidapi.com",
        },
      };

      try {
        const { data } = await axios.request(options);
        res.status(200).send({
          success: true,
          message: "Highlights Fetched Successfully",
          highlights: data?.tray,
        });
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.log(error);
    res.send(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

app.post("/highlight-cover/:url", async (req, res) => {
  try {
    const { url } = req.params;
    // console.log(url);
    if (!url) {
      res.status(500).send({
        success: false,
        message: "No URL Found",
      });
    } else {
      const imageBuffer = await axios.get(url, { responseType: "arraybuffer" });

      const image_base64 = Buffer.from(imageBuffer.data, "binary").toString("base64");

      res.send(`data:${imageBuffer.headers["content-type"]};base64,${image_base64}`);
      
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running at: http://localhost:${PORT}`);
});

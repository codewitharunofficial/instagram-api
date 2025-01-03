import express from "express";
import axios from "axios";
import cors from "cors";
import axiosRetry from "axios-retry";

const app = express();
const PORT = 8081;

app.use(cors({ origin: "*" }));

axiosRetry(axios, {retries: 3, retryDelay: axiosRetry.exponentialDelay});

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
      // console.log(data);

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
            posts_count: data[0]?.media_count,
            isPrivate: data[0]?.is_private,
          },
        });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

app.post("/stories/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const options = {
      method: "GET",
      url: "https://instagram-scraper-api2.p.rapidapi.com/v1/stories",
      params: {
        username_or_id_or_url: username,
      },
      headers: {
        "x-rapidapi-key": "63082bf975mshaf2e4ae44199d66p180054jsne3e705022ef1",
        "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
      },
    };

    try {
      const { data } = await axios.request(options);
      // console.log("Stories:", data?.data?.items);
      res.status(200).send({
        success: true,
        message: "Stories Fetched Successfully",
        stories: data?.data?.items,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
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
            "b1c26628e0msh3fbbf13ea24b4abp184561jsna2ebae86e910",
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
        res.status(500).send({
          success: false,
          message: "Something went wrong",
          error,
        });
      }
    }
  } catch (error) {
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
      const imageBuffer = await axios.get(url, { responseType: "arraybuffer", timeout: 15000 });

      const image_base64 = Buffer.from(imageBuffer.data, "binary").toString(
        "base64"
      );

      res.send(
        `data:${imageBuffer.headers["content-type"]};base64,${image_base64}`
      );
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

app.use("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const options = {
      method: "GET",
      url: "https://instagram-scraper-api2.p.rapidapi.com/v1.2/posts",
      params: {
        username_or_id_or_url: id,
      },
      headers: {
        "x-rapidapi-key": "b1c26628e0msh3fbbf13ea24b4abp184561jsna2ebae86e910",
        "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
      },
    };

    try {
      const { data } = await axios.request(options);

      res.status(200).send({
        success: true,
        message: "Fetched User Posts Successfully",
        posts: data?.data,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

app.use("/post-details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const options = {
      method: "GET",
      url: `https://instagram243.p.rapidapi.com/postdetail/${id}`,
      headers: {
        "x-rapidapi-key": "b1c26628e0msh3fbbf13ea24b4abp184561jsna2ebae86e910",
        "x-rapidapi-host": "instagram243.p.rapidapi.com",
      },
    };

    try {
      const { data } = await axios.request(options);
      res.status(200).send({
        success: true,
        message: "Post Details Found",
        data,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

app.use("/post-comments/:shortcode", async (req, res) => {
  try {
    const { shortcode } = req.params;
    console.log(shortcode);
    const options = {
      method: 'GET',
      url: 'https://instagram-scraper-api2.p.rapidapi.com/v1/comments',
      params: {
        code_or_id_or_url: shortcode
      },
      headers: {
        'x-rapidapi-key': 'b1c26628e0msh3fbbf13ea24b4abp184561jsna2ebae86e910',
        'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com'
      }
    };

    try {
      const { data } = await axios.request(options);
      // console.log(data);
      if (data) {
        res.status(200).send({
          success: true,
          message: "Comments Fetching Successfull",
          comments: data?.data,
        });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

app.use("/download-video/:url/:filename", async (req, res) => {
  const {url, filename} = req.params;
  try {
    const videoBuffer = await axios.get(url, {responseType: 'stream'});
    res.setHeader("Content-Disposition", `attachment; filename=${filename}.mp4`);
    res.setHeader("Content-Type", "video/mp4");
     videoBuffer.data?.pipe(res);
  } catch (error) {
   console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});


app.use("/download-image/:url/:filename", async (req, res) => {
  const {url, filename} = req.params;
  try {
    const imageBuffer = await axios.get(url, {responseType: 'stream'});
    res.setHeader("Content-Disposition", `attachment; filename=${filename}.jpeg`);
    res.setHeader("Content-Type", "image/jpeg");
     imageBuffer.data?.pipe(res);
  } catch (error) {
   console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running at: http://localhost:${PORT}`);
});

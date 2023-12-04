const Blog = require("../app/models/Blog");
module.exports = (io, socket) => {
  const blogclick = async (payload) => {
    const user = payload.user || null;
    if (!user) {
      socket.emit("blog:error");
    } else {
      let likecount;
      try {
        const blog = await Blog.findOne({ title: payload.title });
        likecount = blog.like + 1;
        await Blog.updateOne(
          {
            title: payload.title,
          },
          { like: likecount }
        );
      } catch (error) {}
      io.sockets.emit("blogclick:update", {
        title: payload.title,
        likecount: likecount,
      });
    }
  };
  const blogunclick = async (payload) => {
    const user = payload.user || null;
    if (!user) {
      socket.emit("blog:error");
    } else {
      let likecount;
      try {
        const blog = await Blog.findOne({ title: payload.title });
        likecount = blog.like - 1;
        await Blog.updateOne(
          {
            title: payload.title,
          },
          { like: likecount }
        );
      } catch (error) {}
      io.sockets.emit("blogclick:update", {
        title: payload.title,
        likecount: likecount,
      });
    }
  };
  const blogLoad = async (payload) => {
    let newblogs;
    try {
      const blogs = await Blog.find({});
      newblogs = blogs.map(({ title, like }) => ({ title, like }));
    } catch (error) {}
    socket.emit("blog:get", newblogs);
  };

  socket.on("blogclick:push", blogclick);
  socket.on("blogunclick:push", blogunclick);
  socket.on("blog:load", blogLoad);
};

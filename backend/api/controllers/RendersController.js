/**
 * RenderController
 *
 * @description :: Server-side logic for managing Home
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  home: function (req, res) {
    var query = {
      where : {}
    };
    Leases.count(query, function (err, total){

      var chain = Leases.find(query);

      chain.exec(function (err, Leases){
        if(err){
          return res.json({
            'error' 		: true,
            'message'		: err,
            'error_message' : 'Lỗi truy vấn, vui lòng thử lại hoặc liên hệ BQT'
          });
        }else {
          return res.view('homepage', {datas: Leases, total: total, isHome: true})
        }
      });
    });
  },
  post: function (req, res) {
    var post = req.param('post');
    console.log("Slug:", post);
    Posts.find({where: {slug : post}}).exec(function (err, datas) {
      if(err){
        return res.view('404',{
          'error' 		: true,
          'message'		: err,
          'error_message' : 'Lỗi truy vấn, vui lòng thử lại hoặc liên hệ BQT'
        });
      }else {
        return res.view('post', {data: datas})
      }
    })
  },
  lease: function (req, res) {
    var lease = req.param('lease');

    Leases.find({where: {slug: lease}}).exec(function (err, datas) {
      if(err){
        return res.view('404',{
          'error' 		: true,
          'message'		: err,
          'error_message' : 'Lỗi truy vấn, vui lòng thử lại hoặc liên hệ BQT'
        });
      }else {
        console.log("Lease:", datas);
        return res.view('lease', {data: datas})
      }
    })
  }

};


/**
 * Created by tungtouch on 10/11/15.
 */
/**
 * PostsController
 *
 * @description :: Server-side logic for managing Leases
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  createPost : function (req, res, next){
    var params = req.body;
    var user   = req.user;
    console.log("User:", user);
    console.log("Body:", params);
    if(!user){
      return res.json({
        'error': true,
        'error_message': 'Bạn không có quyền thực hiện hành động này'
      }, 403);
    }
    if(req.method == 'GET'){
      return res.json({
        'error': true,
        'error_message': 'Không hỗ trợ phương thức GET'
      });
    }


    params['user']   = user.id;
    params['active'] = true;
    params['date'] = new Date();

    Posts.create(params).exec(function (err, resp){
      if(err){
        return res.json({
          'error' 		: true,
          'message'		: err,
          'error_message' : 'Lỗi truy vấn, vui lòng liên hệ BQT'
        });
      }
      return res.json({
        'error' 		: false,
        'message'		: "",
        'error_message' : 'Thêm bài viết thành công',
        'data'			: resp
      })
    })
  },

  updatePost : function (req, res, next){
    var params = req.body;
    var user   = req.user;
    console.log("Body:", params);
    if(!user){
      return res.json({
        'error': true,
        'error_message': 'Bạn không có quyền thực hiện hành động này'
      }, 403);
    }
    if(req.method == 'GET'){
      return res.json({
        'error': true,
        'error_message': 'Không hỗ trợ phương thức GET'
      });
    }


    params['user']   = user.id;
    params['active'] = true;
    params['date'] = new Date();

    Posts.update(params.id, params).exec(function (err, resp){
      if(err){
        return res.json({
          'error' 		: true,
          'message'		: err,
          'error_message' : 'Lỗi truy vấn, vui lòng liên hệ BQT'
        });
      }
      return res.json({
        'error' 		: false,
        'message'		: "",
        'error_message' : 'Cập nhật bài viết thành công',
        'data'			: resp
      })
    })
  },
  search: function (req, res, next){
    var params 			= req.query,
      user   			= req.user,
      title 			= req.title;


    if(!user){
      return res.json({
        'error': true,
        'error_message': 'Bạn không có quyền thực hiện hành động này'
      }, 403);
    }
    if(req.method !== 'GET'){
      return res.json({
        'error': true,
        'error_message': 'Không hỗ trợ phương thức'
      });
    }

    var query = {
      like: {}
    };

    if(title){
      query.like['title'] = '%'+title+'%';
    }
    Posts.count(query, function (err, total){
      var chain = Leases.find(query).sort({id: -1});
      chain.exec(function (err, Leases){
        if(err){
          return res.json([]);
        }else {
          return res.json(Leases);
        }
      });
    });

  },
  show: function (req, res, next){
    var params 		  = req.query,
      user          = req.user,
      id            = params.id || 0,
      item_page     = params.item_page || 20,
      page          = params.page || 1;

    if(!user){
      return res.json({
        'error': true,
        'error_message': 'Bạn không có quyền thực hiện hành động này'
      }, 403);
    }
    if(req.method !== 'GET'){
      return res.json({
        'error': true,
        'error_message': 'Không hỗ trợ phương thức'
      });
    }

    var query = {
      where: {}
    };


    Posts.count(query, function (err, total){
      if(!id){
        var chain = Posts.find(query).populate('user').paginate({'page': page, 'limit': item_page});
      }else {
        query['where']['id'] = id;
        var chain = Posts.findOne(query).populate('user').paginate({'page': page, 'limit': item_page});
      }

      chain.exec(function (err, Posts){
        if(err){
          return res.json({
            'error' 		: true,
            'message'		: err,
            'error_message' : 'Lỗi truy vấn, vui lòng thử lại hoặc liên hệ BQT'
          });
        }else {
          return res.json({
            'error' 		: false,
            'message'		: "",
            'error_message' : 'Thành công',
            'data'			: Posts,
            'total'			: total
          })
        }
      });
    });

  },
  uploadPicture: function (req, res, next){
    if(req.method === 'GET'){
      return res.json({
        'error': true,
        'error_message': 'Không hỗ trợ phương thức GET'
      });
    }

    var uploadFile = req.file('file');
    uploadFile.upload({ dirname: '../../assets/images/uploads', maxBytes: 1000000 }, function onUploadComplete (err, files) {
      if (err) return res.serverError(err);

      var filename = files[0].fd.split('\/');
      filename = filename[filename.length - 1];
      res.json({
        'error'         : true,
        'error_message' : "Thành công",
        'data'			: filename
      });
    });
  }
};

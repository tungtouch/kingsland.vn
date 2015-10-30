/**
 * ProjectsController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	createProject : function (req, res, next){
		var params = req.body;
		var user   = req.user;
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
		
		Projects.create(params).exec(function (err, resp){
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
				'error_message' : 'Thêm dự án thành công',
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
		Projects.count(query, function (err, total){
			var chain = Projects.find(query).sort({id: -1});
				chain.exec(function (err, projects){
					if(err){
						return res.json([]);
					}else {
						return res.json(projects);
					}
				});
		});

	},
	show: function (req, res, next){
		var params 		  = req.query,
			user          = req.user,
			id            = params.id || 0,
			item_page     = params.item_page || 20,
			page          = params.page || 1,
			discount_type = params.discount_type || 0,
			project_type  = params.project_type || 0,
			project_status= params.project_status || 0,
			tip_sort      = params.tip_sort || 0,
			title         = params.title || 0,
			city          = params.city || 0,
			district      = params.district || 0;

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

		if(discount_type){
			query.where['discount_type'] = discount_type;
		}
		if(title){
			query.where['like'] = {title: '%' + title + '&'};
		}
		if(city){
			query.where['city'] = city;	
		}
		if(district){
			query.where['district'] = district;	
		}

		if(project_type){
			query.where['project_type'] = project_type;	
		}

		if(project_status){
			query.where['project_status'] = project_status;	
		}
		

		
		if(tip_sort){
			tip_sort = tip_sort == 'DESC' ? 0 : 1; 
			query['sort'] = {'discount_amount': tip_sort};
		}

		Projects.count(query, function (err, total){
			if(!id){
				var chain = Projects.find(query).populate('city').sort({id: -1}).populate('district').paginate({'page': page, 'limit': item_page});
			}else {
				query['where']['id'] = id;
				var chain = Projects.findOne(query).populate('city').sort({id: -1}).populate('district').paginate({'page': page, 'limit': item_page});
			}
			
			chain.exec(function (err, projects){
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
						'data'			: projects,
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

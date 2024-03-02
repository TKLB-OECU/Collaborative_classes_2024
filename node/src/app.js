// 必要なモジュールをインポート
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// ルーターモジュールのインポート
var indexRouter = require('./routes/index');
var CreateRouter = require('./routes/3dCreate');
var MotionRouter = require('./routes/3dMotion');
var LectureDocuments = require('./routes/LectureDocuments');

// Expressアプリケーションの作成
var app = express();

// view engine setup
// ビューエンジンとしてEJSを使用し、ビューのディレクトリを設定
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ミドルウェアの設定
app.use(logger('dev'));  // 開発用のログ出力を有効にする
app.use(express.json());  // リクエストボディのJSONを解析
app.use(express.urlencoded({ extended: false }));  // URLエンコードされたリクエストボディを解析
app.use(cookieParser());  // Cookieを解析
app.use(express.static(path.join(__dirname, 'public')));  // 静的ファイルの提供
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));// 静的ファイルの提供


// ルーターミドルウェアの設定
app.use('/', indexRouter);
app.use('/3dCreate', CreateRouter);
app.use('/3dMotion', MotionRouter);
app.use('/LectureDocuments', LectureDocuments);

// 404エラー時のハンドリング
app.use(function(req, res, next) {
  next(createError(404));
});

// エラーハンドリング
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // エラーページのレンダリング
  res.status(err.status || 500);
  res.render('error');
});

// Expressアプリケーションのエクスポート
module.exports = app;


<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
    <meta name="generator" content="Jekyll v4.0.1">

    <link rel="apple-touch-icon" sizes="180x180" href="assets/fav/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/fav/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/fav/favicon-16x16.png">
    <link rel="manifest" href="assets/fav/site.webmanifest">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <link rel="stylesheet"
          href="assets/css/font.css">

    <title>BuilderJS · Home</title>
    <script src="assets/js/jquery-3.5.1.min.js"></script>
    <link rel="stylesheet" href="assets/bootstrap-4.5.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/sample.css">


    <style>
      .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      .item-desc a {
          color: #555;
      }
      
      .card img {
        -webkit-transition: opacity 0.5s ease-in-out;
        -moz-transition: opacity 0.5s ease-in-out;
        -ms-transition: opacity 0.5s ease-in-out;
        -o-transition: opacity 0.5s ease-in-out;
        transition: opacity 0.5s ease-in-out;
      }

      .btn-primary {
          color: #fff;
          background-color: #e76916;
          border-color: #e76916;
      }

      .btn-primary:hover {
          color: #fff;
          background-color: #ff7d28;
          border-color: #ff7d28;
      }

      .btn-primary:not(:disabled):not(.disabled).active, .btn-primary:not(:disabled):not(.disabled):active, .show>.btn-primary.dropdown-toggle {
          color: #fff;
          background-color: #ff7d28;
          border-color: #ff7d28;
      }

      .btn-primary.focus, .btn-primary:focus {
          color: #fff;
          background-color: #ff7d28;
          border-color: #ff7d28;
          box-shadow: 0 0 0 0.2rem rgba(255, 166, 38, 0.5);
      }

      .card img:hover {
        opacity: 0.8;
      }

      .shadow-sm {
          box-shadow: 0 .125rem .5rem rgba(0,0,0,.2)!important;
      }

      @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
      }
    </style>
    <!-- Custom styles for this template -->
    <link href="assets/css/album.css" rel="stylesheet">
  </head>
  <body>
  <header>
  <div class="navbar navbar-dark bg-dark shadow-sm">
    <div class="container d-flex justify-content-between">
      <a class="navbar-brand" href="#">
                <span class="d-flex align-items-center">
                    <img class="mr-3" src="assets/image/builderjs_color_logo.png" width="30" height="30" alt="Builder JS" role="presentation">
                    <span class="logo__HiddenText-s1uxqgbl-1 logo-1">
                        <span class="d-flex align-items-center logo-1-inner">
                          <span class="font-weight-light">Builder</span>
                          <span class="logo-1-js">JS</span>
                        </span>
                    </span>
                </span>
        </a>
      <form class="form-inline mt-2 mt-md-0">
                <button onclick="alert('Can not upload template from DEMO site!');" class="btn btn-primary my-2 my-sm-0" type="submit">Upload Template</button>
            </form>
    </div>
  </div>

  <script>
      $(document).ready(function() {
        $('.scroll-to').click(function(e) {
          e.preventDefault();
          var target = $($(this).attr('href'));

          $('html, body').animate({
            scrollTop: target.offset().top
          }, 500);
        });
      });
  </script>
</header>

<main role="main">

  <section class="jumbotron">
    <div class="hover"></div>
    <div class="container">
      <div class="row">
        <div class="col-md-6 py-5 mt-4">
          <h1 class="my-4 pt-4" style="font-size:24px">Welcome to <br/><span class="font-family-comf">Builder</span><span class="js-2">JS</span></h1>
          <p class="lead">The fully-featured and comprehensive design platform for emails and web pages. Visually design your beautiful emails or HTML pages the joyful way with an advanced Drag & Drop editor.</p>
          <p class="my-4">
            <a href="#example" class="btn btn-primary my-2 mr-2 scroll-to">Start Designing</a>
            <a href="https://codecanyon.net/item/builderjs-html-email-page-builder/27146783" class="btn btn-secondary my-2">Buy &amp; Download</a>
          </p>
        </div>
        <div class="col-md-6">
          <img src="assets/image/builder.svg"/>
        </div>
      </div>
    </div>
  </section>

  <div class="album py-5 bg-light" id="example">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="font-weight-normal font-size-40">Getting started with a template</h2>
        <p class="text-muted">
          Start your design by choosing one of available layout templates that come with BuilderJS.
        </p>
      </div>
      <div class="row">
        <?php
            $dir = __DIR__ . DIRECTORY_SEPARATOR . "assets/templates/layouts/";
            $templateUrl = array_diff(scandir($dir), array('..', '.'));
            foreach ($templateUrl as $name) {
              if ($name != '0_3_form_builder') {
                $path = __DIR__ . DIRECTORY_SEPARATOR . "assets/templates/layouts/" . $name;
                $files = glob($path . "/index.html");
                $content = file_get_contents($files[0]);
                $preg_matchs = preg_match_all('/(<title\>([^<]*)\<\/title\>)/i', $content, $m);
                $title = $m[2][0];

                $id = base64_encode($name);
        ?>
            <div class="col-md-3">
            <div class="card mb-4 shadow-sm">
                <a target="_blank" type="button" href="design.php?id=<?php echo $id ?>&type=layouts">
                  <img width="100%" height="100%" class="_1xvs1" src="assets/templates/layouts/<?php echo $name?>/thumb.png" title="<?php echo $title ?>" alt="<?php echo $title ?>">
                </a>
                <div class="card-body">
                <h5><?php echo $title ?></h5>
                <div class="JHf2a mb-4 small text-muted item-desc"><i> by </i><a class="R8zaM" href="javascript:;">BuilderJS</a><span> at </span><a class="R8zaM" href="javascript:;">SorrentoCorp</a></div>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                    <a target="_blank" type="button" href="design.php?id=<?php echo $id ?>&type=layouts" class="btn btn-sm btn-primary">Design</a>
                    </div>
                    <small class="text-muted">Layout</small>
                </div>
                </div>
            </div>
            </div>
        <?php } } ?>
      </div>
    </div>
  </div>

  <div class="album py-5 bg-light">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="font-weight-normal font-size-40">Or upload your template and edit</h2>
        <p class="text-muted">
          If you already have an email or page template, just load it to the editor and start editing...
        </p>
      </div>

      <div class="row">
        <?php
            $dir = __DIR__ . DIRECTORY_SEPARATOR . "assets/templates/other/";
            $templateUrl = array_diff(scandir($dir), array('..', '.'));
            foreach ($templateUrl as $name) {
                $path = __DIR__ . DIRECTORY_SEPARATOR . "assets/templates/other/" . $name;
                $files = glob($path . "/index.html");
                $content = file_get_contents($files[0]);
                $preg_matchs = preg_match_all('/(<title\>([^<]*)\<\/title\>)/i', $content, $m);
                $title = $m[2][0];

                $id = base64_encode($name);
        ?>
            <div class="col-md-3">
            <div class="card mb-4 shadow-sm">
                <a target="_blank" type="button" href="design.php?id=<?php echo $id ?>&type=other">
                  <img width="100%" height="100%" class="_1xvs1" src="assets/templates/other/<?php echo $name?>/thumb.png" title="<?php echo $title ?>" alt="<?php echo $title ?>">
                </a>
                <div class="card-body">
                <h6 class="h6-title" title="<?php echo $title ?>"><?php echo $title ?></h6>
                <div class="JHf2a mb-4 small text-muted item-desc"><i> by </i><a class="R8zaM" href="javascript:;">BuilderJS</a><span> at </span><a class="R8zaM" href="javascript:;">SorrentoCorp</a></div>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                    <a target="_blank" type="button" href="design.php?id=<?php echo $id ?>&type=other" class="btn btn-sm btn-primary">Design</a>
                    </div>
                    <small class="text-muted">Layout</small>
                </div>
                </div>
            </div>
            </div>
        <?php } ?>
      </div>
    </div>
  </div>

</main>

<footer class="text-muted">
  <div class="container">
    <p class="float-right">
      <a href="#">Back to top</a>
    </p>
    <p>© 2020 Sorrento Corp. Trademarks and brands are the property of their respective owners.</p>
  </div>
</footer>
</html>

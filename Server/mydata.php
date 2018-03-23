<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>
<html>
    <head>
        <link href="js/jquery.json-viewer.css" type="text/css" rel="stylesheet" />
    </head>
    <body>
        <h1>Collected data</h1><hr/>
        <pre id="json-renderer"></pre>
    <script src="js/jquery.min.js"></script>
    <script src="js/jquery.json-viewer.js"></script>
    <script src="js/jquery.json-viewer.execute.js"></script>
    <?php
    if(isset($_POST['data'])):
    ?>
    <script>
    var result = <?=$_POST['data']?>;
    $(document).ready(function () {
        $('#json-renderer').jsonViewer(result, {collapsed: false,withQuotes: false});
    });
    </script>
    <?php
    endif;
    ?>

    <?php
    if(isset($_GET['data'])):
    	$str = substr($_SERVER['QUERY_STRING'], 5);
    	$str = str_replace("%22", "\"", $str);
    	$str = str_replace("%27", "'", $str);
    ?>
    <script>
    var result = <?=$str?>;
    $(document).ready(function () {
        $('#json-renderer').jsonViewer(result, {collapsed: false,withQuotes: false});
    });
    </script>
    <?php
    endif;
    ?>
    </body>
</html>


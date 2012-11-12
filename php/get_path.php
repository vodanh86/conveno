<?

define(MBASE_DIR, "");

if (isset($_GET["jsonp"]) && isset($_GET["app_id"]) && isset($_GET["path_id"])) {
	$path = MBASE_DIR . "../view/" . intval($_GET["app_id"]) . "/path/" . intval($_GET["path_id"]) . "/path.json";
//	$path = "../app/".intval($_GET["app_id"])."/view/path/".intval($_GET["path_id"])."/path.json";
	if (file_exists($path)) {
		$json = file_get_contents($path);
		echo $_GET["jsonp"] . "($json);";
		flush();
		exit();
	}
}
header("HTTP/1.0 404 Not Found");

?>

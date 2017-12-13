<?php
$puzzles = array(
array("title"=>"Ninjago","raster"=>4,"url"=>"http://www.brickshow.tv/news/wp-content/uploads/2015/11/22805789345_dc2d19e97d_o.jpg"),
array("title"=>"Lego superhelden","raster"=>6,"url"=>"http://farm8.staticflickr.com/7419/10178671123_a41eb9a9ae.jpg"),
array("title"=>"Real Madrid","raster"=>5,"url"=>"https://cdn.vox-cdn.com/thumbor/5xn_TI4JaPu1o0j79fmpYdiujhs=/0x0:3000x2000/1200x800/filters:focal(697x560:1177x1040)/cdn.vox-cdn.com/uploads/chorus_image/image/54394025/670523882.0.jpg"),
array("title"=>"Peppa Big","raster"=>3,"url"=>"http://fr.web.img1.acsta.net/pictures/15/08/25/12/30/384072.jpg"),
array("title"=>"Pieter Konijn","raster"=>3,"url"=>"https://www.ploegsma.nl/wp-content/uploads/sites/2/2015/08/Pieterkonijngzapp.jpg"),
array("title"=>"Oggy","raster"=>4,"url"=>"http://cdn.kidscreen.com/wp/wp-content/uploads/2015/12/Oggy.jpg?69412a"),
array("title"=>"Monsters Inc","raster"=>5,"url"=>"http://www4.pictures.zimbio.com/mp/_2Ea3335aJfx.jpg"),
array("title"=>"Disney","raster"=>5,"url"=>"https://i.ytimg.com/vi/g1s7QITvhoA/maxresdefault.jpg"),
array("title"=>"Mr Bean","raster"=>5,"url"=>"https://ewedit.files.wordpress.com/2015/09/mr-bean-00.jpg?w=1024"),


);

$debug=false;

$startpuzzle = rand(0,count($puzzles)-1);
$startpuzzle=$puzzles[$startpuzzle];

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
    <title>Focus Puzzle</title>
	
	<!-- for webapp -->
	<!-- Startup configuration -->
	<link rel="manifest" href="manifest.json">

	<!-- Fallback application metadata for legacy browsers -->
	<meta name="application-name" content="Focus Puzzle">
	
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
	<meta name="theme-color" content="#ffffff">
	<!-- end -->
	
	
    <script src="js/react.min.js"></script>
    <script src="js/react-dom.min.js"></script>
    <script src="js/browser.min.js"></script>
	<script src="js/fdrag.js"></script>
	<script src="js/memory.js"></script>
	<link href="css/style.css" rel="stylesheet" type="text/css" />
	<script>
	document.addEventListener('DOMContentLoaded', function(){ 
		var puzzle = new fPuzzle();
		puzzle.initPuzzle('{"raster":<?php echo $startpuzzle["raster"];?>,"imageurl":"<?php echo $startpuzzle["url"];?>"}');
		
	});
	</script>
	
</head>
<body>
	<div id="loading">Laden...</div>
	
	<?php if($debug){?>
	<div id="log">log</div>
	<?php } ?>
	
	<div id="menuWrap">
		<div id="bodyOverlay"></div>
		
		<div id="showMenuBtn"></div>
		
		<div id="menuAnimate">
			<div id="menu">
				
				<div id="puzzleExample">
					<div id="puzzleOptions">
						<select id="raster" name="raster">
							<option value="2">4</option>
							<option value="3">9</option>
							<option value="4">16</option>
							<option value="5">25</option>
							<option value="6">36</option>
							<option value="7">49</option>
							<option value="8">64</option>
							<option value="9">81</option>
							<option value="10">100</option>
							
						</select>
					</div>
				</div>
			
				<?php
				foreach($puzzles as $puzzle){
					?>
					<span class="newPuzzle btn" data-raster="<?php echo $puzzle["raster"];?>" data-imageurl="<?php echo $puzzle["url"];?>"><span class="preview" style="background-image:url('<?php echo $puzzle["url"];?>');"></span> <?php echo $puzzle["title"];?></span>
					
					<?php
				}
				?>
			
				
				<span id="resetPuzzle">Reset</span>
				
				--
				<form id="form1" runat="server">
					<input type="file" id="imgInp" />
					
				</form>
				--
				
			</div><!-- #menu -->
		</div><!-- #menuAnimate -->
	</div><!-- #menuWrap -->
    <div class="puzzle">
	
		<div id="puzzleBoard">
			<div id="puzzleBoardBg"></div>
		</div>
		
		<div id="puzzlePieces">
			
			
		</div>
		
		
	</div>
	
	
	<?php if(1==0){?>
	<div id="container"></div>
	
    <script type="text/babel">
       
		var Groet = React.createClass({
			getInitialState:function(){
				return {bert:1}
			},
			shout:function(){
				alert('HOILO');
			},
			render:function(){
				return (<button onClick={this.shout}>Hoi {this.props.naam}! {this.props.children}</button>);
			}
		});
		
		ReactDOM.render(
            <div><Groet naam="Bert">Dit is bericht binnen tags</Groet><Groet naam="Judith" /></div>,
            document.getElementById('container')
        );
    </script>
	<?php } ?>
</body>
</html>

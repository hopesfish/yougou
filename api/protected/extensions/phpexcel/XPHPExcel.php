<?php

/**
 * Wrapper for the PHPExcel library.
 * @see README.md
 */
class XPHPExcel extends CComponent
{
	private static $_isInitialized = false;
	
	/**
	 * Register autoloader.
	 */
	public static function init()
	{
		if (!self::$_isInitialized) {
			spl_autoload_unregister(array('YiiBase', 'autoload'));
			require(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'PHPExcel.php');
			spl_autoload_register(array('YiiBase', 'autoload'));
			
			self::$_isInitialized = true;
		}
	}
	
	/**
	 * Returns new PHPExcel object. Automatically registers autoloader.
	 * @return PHPExcel
	 */
	public static function createPHPExcel()
	{
		self::init();
		return new PHPExcel;
	}

	public static function readExcel($filePath)
	{
		self::init();
		
		$PHPReader = new PHPExcel_Reader_Excel2007();
		if(!$PHPReader->canRead($filePath)){
		    $PHPReader = new PHPExcel_Reader_Excel5();
		    if(!$PHPReader->canRead($filePath)){
		        return null;
		    }
		}

		return $PHPReader->load($filePath);
	}
}
#!/usr/bin/perl
#
# Version: 8-)@(#)@(201111) 09.00.01.06.00
# $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/images/employees/jpgcat.pl,v 1.2 2003/04/18 15:52:26 keno Exp $
#
# This script reads in a company number and directory path and 
# renames all jpg files in that directory with the company name
# appended to the front of each image name.  
# An option exists to undo the last append [jpgcat -u].  See print
# statements below or type jpgcat at the prompt for full usage.
# Company number is required except on an undo operation, where
# it is optional.  If a company number is entered on an undo, the
# program verifies that it matches the company number appended to
# each image in the employee picture directory.
# Directory is defaulted to $img_dir, the directory in which the 
# program currently resides.  For Information Office, this is
# $WEBDIR/lawson/hrnet/images/employees.
#
# e.g., jpgcat.pl -c 100 
#       jpgcat.pl -c 100 -d $LAWDIR/webdocs/hrnet/images/employees
#		jpgcat.pl -c 100 -u
#       jpgcat.pl -u
#

open DIRPATH, "pwd |" or die "Can't get default directory path: $!\n";
$img_dir = <DIRPATH>;
close DIRPATH;
chop($img_dir);

##############################################################

if (@ARGV == 0) {
	print "\n";
	print "Usage:  To append a company number onto employee picture names\n";
	print "Syntax: jpgcat.pl [-c] CompanyNumber [-d] PictureDirectory [-u]\n"; 
	print "         c - Company number to append to picture names\n";
	print "         d - Employee picture directory\n";
	print "         u - Undo a company name append\n\n";
	exit;
}

$cmp = "";
$dir = "";
$undo = 0;

# first get any command-line flags or arguments
while (@ARGV > 0) {
   if ($ARGV[0] =~ /^-/) {
   	   $flag = shift(@ARGV);
   		if ($flag =~ /^-c/) { 
   		 	$cmp = shift(@ARGV);
			if ($cmp =~ /^-/) {
				print "Incorrect number of arguments.\n";
				exit;
		   	}
   		 }
   		 elsif ($flag =~ /^-d/) {
   		 	$dir = shift(@ARGV);
			if ($dir =~ /^-/) {
				print "Incorrect number of arguments.\n";
				exit;
			}
   		 }
		 elsif ($flag =~ /^-u/) {
		 	$undo = 1;
		 }
		 else {
		    print "Invalid option: $flag.\n";
		 	exit;
		 }
  	}
	else {
		print "Incorrect number of arguments.\n";
		exit;
	}
}

# company is required
if (!$cmp && !$undo) {
  	print "Company number is required.\n";
	exit;
}

# override default dir path
# if the user gives a URL, attach the base directory path up to
# the first lawson directory found
if ($dir) {
   if ($dir =~ /^http:/ && $dir =~ /(\w)+\/lawson(\w)*/s && $img_dir =~ /(\w)+\/lawson(\w)*/s) {
   		@pwddirs = split /\/lawson/, $img_dir;
		@userdirs = split /\/lawson/, $dir;
		if (@userdirs > 2) {
		    for ($i=2;$i<@userdirs;$i++) {
				$userdirs[1] .= "/lawson" . $userdirs[$i];
			}
		}
   		$dir = $pwddirs[0] . "/lawson" . $userdirs[1]; 	   
   }
   $img_dir = $dir;
}
elsif (length($img_dir) == 0) {
	print "Could not find current directory path.\n";
	exit;
}

# company is always first four digits of image name
# rest of image name is employee id
$len = length $cmp;
if ($len > 4) {
	print "Company number can be at most four digits.\n";
	exit;
}	
for ($i=$len;$i<4;$i++) {
	$cmp = 0 . $cmp;
}

# make sure we don't have a trailing slash
# on dir path
@links = split /\//, $img_dir;
$img_dir = join '/', @links;

# open the dir for modification and grab all jpgs
opendir IMGDIR, "$img_dir" or die "Can't read image directory: $!\n";
@jpgfiles = grep /\.jpg$/, map "$img_dir/$_", readdir IMGDIR;
closedir IMGDIR;

if (@jpgfiles == 0) {
   print "No jpg files found in directory: $img_dir.\n";
   exit;
}

$success = 1;

if ($undo) {
	foreach $jpg (@jpgfiles)
	{
	 	@pathdirs = split /\//, $jpg;
		$len = @pathdirs - 1;
		$stop = length($pathdirs[$len]);
		if ($stop < 9) {
		    $success = 0;
			print "Invalid picture format: $jpg\n";
		}
		else {
			$cpy = substr($pathdirs[$len],1,5);
			$pathdirs[$len] = substr($pathdirs[$len],5,$stop);
			@empstr = split /\./, $pathdirs[$len];
			$pathdirs[$len] = $empstr[0]; 
			for ($i=length($pathdirs[$len]);$i<9;$i++) {
			    $pathdirs[$len] = 0 . $pathdirs[$len];
			}
			$pathdirs[$len] = "P" . $pathdirs[$len] . "." . $empstr[1];
	  		if ($cmp ne "" && int($cmp) != 0 && int($cpy) != int($cmp)) {
			    $success = 0;
				print "Company $cmp not matched on picture: $jpg\n";
			}
			else {
				$new_jpg = join '/', @pathdirs;
				@args = ("mv", $jpg, $new_jpg);
				&exec_command(@args);
			}	
		}
  	}
	&return_msg();
	exit;
}

# append the company argument to each jpg filename
foreach $jpg (@jpgfiles)
{
   @pathdirs = split /\//, $jpg;
   $len = @pathdirs - 1;
   print "$pathdirs[$len]  ";
   if(substr($pathdirs[$len],0,1) == "P") {
   		$pathdirs[$len] = substr($pathdirs[$len],1,length($pathdirs[$len]));
   }
   print "$pathdirs[$len]\n";
   @imgnm = split /\./, $pathdirs[$len];
   $empid = $imgnm[0];
   if ($empid != 0 && int($empid) == 0) {
   	    $success = 0;
   		print "Image $jpg is not named correctly (i.e., <emp_nbr>.jpg)\n";
   }
   else {
   		$numchars = length($empid);
   		for ($i=$numchars;$i<9;$i++) {
   			$pathdirs[$len] = 0 . $pathdirs[$len];
   		}
   		$pathdirs[$len] = "P" . $cmp . $pathdirs[$len];
   		$new_jpg = join '/', @pathdirs; 
   		@args = ("mv", $jpg, $new_jpg);
   		&exec_command(@args);
 	}
}

&return_msg();

sub exec_command (@args) {
	$rc = 0xffff & system @args;
	# printf "System(%s) returned %#04x: ", "@args", $rc;
	if ($rc != 0) {
		$sucess = 0;
		print "Error renaming file to $new_jpg: $!\n";
	}
	if ($rc == 0xff00) {
		$success = 0;
		print "Command failed: $!\n";
	}
	elsif ($rc != 0) {
		$sucess = 0;
		print "ran with ";
		if ($rc & 0x80) {
			$rc &= ~0x80;	
			print "coredump from ";		
		}
		print "signal $rc.\n"	
	}
}

sub return_msg {
	if ($success) {
		print "*** Operation succeeded. ***\n";
	}
}

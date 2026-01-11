#!/usr/bin/env python3
"""
Script to automatically fetch missing YouTube IDs and Deezer IDs for songs in songs.js
Uses ytmusicapi for YouTube Music and Deezer API for Deezer tracks.

Usage:
    python3 update-ids.py
"""

from ytmusicapi import YTMusic
import requests
import re
import time

def extract_songs_from_file(filepath):
    """Extract all songs from the songs.js file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match songs with or without youtubeId and deezerId
    pattern = r'\{\s*title:\s*"([^"]+)",\s*artist:\s*"([^"]+)",\s*year:\s*(\d+)(?:,\s*youtubeId:\s*"([^"]*)")?(?:,\s*deezerId:\s*"([^"]*)")?\s*\}'
    
    songs = []
    for match in re.finditer(pattern, content):
        song = {
            'title': match.group(1),
            'artist': match.group(2),
            'year': int(match.group(3)),
            'youtubeId': match.group(4) if match.group(4) else None,
            'deezerId': match.group(5) if match.group(5) else None
        }
        songs.append(song)
    
    return songs, content

def fetch_youtube_id(ytmusic, title, artist):
    """Fetch YouTube ID from YouTube Music API."""
    try:
        search_query = f"{title} {artist}"
        search_results = ytmusic.search(search_query, filter="songs", limit=1)
        
        if search_results and len(search_results) > 0:
            video_id = search_results[0].get('videoId')
            return video_id
        return None
    except Exception as e:
        print(f"  ✗ YouTube error: {e}")
        return None

def fetch_deezer_id(title, artist):
    """Fetch Deezer track ID from Deezer API."""
    try:
        search_query = f"{title} {artist}"
        url = "https://api.deezer.com/search"
        params = {'q': search_query}
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('data') and len(data['data']) > 0:
                track = data['data'][0]
                return str(track['id'])
        
        return None
        
    except Exception as e:
        print(f"  ✗ Deezer error: {e}")
        return None

def update_songs_file(filepath, youtube_updates, deezer_updates):
    """Update the songs.js file with new YouTube and Deezer IDs."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # First, update YouTube IDs
    for song_key, youtube_id in youtube_updates.items():
        title, artist = song_key
        
        # Pattern to find song and update/add youtubeId (before deezerId if it exists)
        pattern_with_id = rf'(\{{\s*title:\s*"{re.escape(title)}",\s*artist:\s*"{re.escape(artist)}",\s*year:\s*\d+,\s*youtubeId:\s*")[^"]*(")' 
        
        def replacer_with_id(match):
            return match.group(1) + youtube_id + match.group(2)
        
        new_content = re.sub(pattern_with_id, replacer_with_id, content, flags=re.DOTALL)
        
        # If no change, song doesn't have youtubeId yet, add it
        if new_content == content:
            # Add youtubeId before deezerId if exists, otherwise at end
            pattern_without_id = rf'(\{{\s*title:\s*"{re.escape(title)}",\s*artist:\s*"{re.escape(artist)}",\s*year:\s*\d+)((?:,\s*deezerId:\s*"[^"]*")?)(\s*\}})'
            
            def replacer_without_id(match):
                return match.group(1) + f', youtubeId: "{youtube_id}"' + match.group(2) + match.group(3)
            
            new_content = re.sub(
                pattern_without_id, 
                replacer_without_id, 
                content, 
                flags=re.DOTALL
            )
        
        content = new_content
    
    # Then, update Deezer IDs
    for song_key, deezer_id in deezer_updates.items():
        title, artist = song_key
        
        # Pattern to find song and update/add deezerId
        pattern_with_id = rf'(\{{\s*title:\s*"{re.escape(title)}",\s*artist:\s*"{re.escape(artist)}",\s*year:\s*\d+,\s*youtubeId:\s*"[^"]*",\s*deezerId:\s*")[^"]*(")' 
        
        def replacer_with_id(match):
            return match.group(1) + deezer_id + match.group(2)
        
        new_content = re.sub(pattern_with_id, replacer_with_id, content, flags=re.DOTALL)
        
        # If no change, song doesn't have deezerId yet, add it
        if new_content == content:
            pattern_without_id = rf'(\{{\s*title:\s*"{re.escape(title)}",\s*artist:\s*"{re.escape(artist)}",\s*year:\s*\d+,\s*youtubeId:\s*"[^"]*")(\s*\}})'
            
            def replacer_without_id(match):
                return match.group(1) + f', deezerId: "{deezer_id}"' + match.group(2)
            
            new_content = re.sub(
                pattern_without_id, 
                replacer_without_id, 
                content, 
                flags=re.DOTALL
            )
        
        content = new_content
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    filepath = 'src/data/songs.js'
    
    print("=" * 60)
    print("ID Updater for Hitster Game")
    print("Fetches missing YouTube IDs and Deezer IDs")
    print("=" * 60)
    print()
    
    # Extract songs from file
    print("📖 Reading songs.js file...")
    songs, content = extract_songs_from_file(filepath)
    print(f"✓ Found {len(songs)} songs in file\n")
    
    # Find songs without YouTube IDs or Deezer IDs
    missing_youtube = [s for s in songs if not s['youtubeId'] or s['youtubeId'].strip() == '']
    missing_deezer = [s for s in songs if not s['deezerId'] or s['deezerId'].strip() == '']
    
    if not missing_youtube and not missing_deezer:
        print("✅ All songs already have both YouTube and Deezer IDs!")
        print("Nothing to update.")
        return
    
    print(f"🔍 Found {len(missing_youtube)} songs without YouTube IDs")
    print(f"🔍 Found {len(missing_deezer)} songs without Deezer IDs\n")
    
    youtube_updates = {}
    youtube_failed = []
    deezer_updates = {}
    deezer_failed = []
    
    # Fetch missing YouTube IDs
    if missing_youtube:
        print("🎵 Initializing YouTube Music API...")
        ytmusic = YTMusic()
        print("✓ YouTube API ready\n")
        
        print("🔎 Fetching missing YouTube IDs...\n")
        for i, song in enumerate(missing_youtube, 1):
            print(f"[{i}/{len(missing_youtube)}] {song['title']} - {song['artist']}")
            
            youtube_id = fetch_youtube_id(ytmusic, song['title'], song['artist'])
            
            if youtube_id:
                youtube_updates[(song['title'], song['artist'])] = youtube_id
                print(f"  ✓ YouTube: {youtube_id}")
            else:
                youtube_failed.append(song)
                print(f"  ✗ YouTube: Not found")
            
            # Small delay to avoid rate limiting
            if i < len(missing_youtube):
                time.sleep(0.3)
        
        print()
    
    # Fetch missing Deezer IDs
    if missing_deezer:
        print("🎧 Fetching missing Deezer IDs...\n")
        for i, song in enumerate(missing_deezer, 1):
            print(f"[{i}/{len(missing_deezer)}] {song['title']} - {song['artist']}")
            
            deezer_id = fetch_deezer_id(song['title'], song['artist'])
            
            if deezer_id:
                deezer_updates[(song['title'], song['artist'])] = deezer_id
                print(f"  ✓ Deezer: {deezer_id}")
            else:
                deezer_failed.append(song)
                print(f"  ✗ Deezer: Not found")
            
            # Small delay to avoid rate limiting
            if i < len(missing_deezer):
                time.sleep(0.3)
        
        print()
    
    print("=" * 60)
    print("RESULTS:")
    print(f"  YouTube IDs - Successfully fetched: {len(youtube_updates)}, Failed: {len(youtube_failed)}")
    print(f"  Deezer IDs  - Successfully fetched: {len(deezer_updates)}, Failed: {len(deezer_failed)}")
    print("=" * 60)
    print()
    
    # Update the file
    if youtube_updates or deezer_updates:
        print("💾 Updating songs.js file...")
        update_songs_file(filepath, youtube_updates, deezer_updates)
        print(f"✓ Updated songs in {filepath}")
        if youtube_updates:
            print(f"  - Added/updated {len(youtube_updates)} YouTube IDs")
        if deezer_updates:
            print(f"  - Added/updated {len(deezer_updates)} Deezer IDs")
    
    # Show failed songs
    if youtube_failed:
        print("\n⚠️  Failed to find YouTube IDs for:")
        for song in youtube_failed:
            print(f"  - {song['title']} by {song['artist']} ({song['year']})")
    
    if deezer_failed:
        print("\n⚠️  Failed to find Deezer IDs for:")
        for song in deezer_failed:
            print(f"  - {song['title']} by {song['artist']} ({song['year']})")
    
    if youtube_failed or deezer_failed:
        print("\nYou may need to manually add these IDs.")
    
    print("\n✅ Done!")

if __name__ == "__main__":
    main()

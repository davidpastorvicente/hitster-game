#!/usr/bin/env python3
"""
Script to automatically fetch missing YouTube IDs, Deezer IDs, preview URLs, and album covers for songs in songs.js
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
    
    # Pattern to match songs with optional fields (no deezerPreview)
    pattern = r'\{\s*title:\s*"([^"]+)",\s*artist:\s*"([^"]+)",\s*year:\s*(\d+)(?:,\s*youtubeId:\s*"([^"]*)")?(?:,\s*deezerId:\s*"([^"]*)")?(?:,\s*albumCover:\s*"([^"]*)")?\s*\}'
    
    songs = []
    for match in re.finditer(pattern, content):
        song = {
            'title': match.group(1),
            'artist': match.group(2),
            'year': int(match.group(3)),
            'youtubeId': match.group(4) if match.group(4) else None,
            'deezerId': match.group(5) if match.group(5) else None,
            'albumCover': match.group(6) if match.group(6) else None
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

def fetch_deezer_data(title, artist):
    """Fetch Deezer track ID and album cover from Deezer API (preview URLs expire, so we fetch at runtime)."""
    try:
        search_query = f"{title} {artist}"
        url = "https://api.deezer.com/search"
        params = {'q': search_query}
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('data') and len(data['data']) > 0:
                track = data['data'][0]
                return {
                    'deezerId': str(track['id']),
                    'albumCover': track.get('album', {}).get('cover_medium')
                }
        
        return None
        
    except Exception as e:
        print(f"  ✗ Deezer error: {e}")
        return None

def update_songs_file(filepath, youtube_updates, deezer_updates):
    """Update the songs.js file with new YouTube IDs, Deezer IDs, and album covers (no preview URLs)."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # First, update YouTube IDs
    for song_key, youtube_id in youtube_updates.items():
        title, artist = song_key
        
        # Pattern to find song and update/add youtubeId
        pattern_with_id = rf'(\{{\s*title:\s*"{re.escape(title)}",\s*artist:\s*"{re.escape(artist)}",\s*year:\s*\d+,\s*youtubeId:\s*")[^"]*(")' 
        
        def replacer_with_id(match):
            return match.group(1) + youtube_id + match.group(2)
        
        new_content = re.sub(pattern_with_id, replacer_with_id, content, flags=re.DOTALL)
        
        # If no change, song doesn't have youtubeId yet, add it
        if new_content == content:
            pattern_without_id = rf'(\{{\s*title:\s*"{re.escape(title)}",\s*artist:\s*"{re.escape(artist)}",\s*year:\s*\d+)((?:,\s*(?:deezerId|albumCover):\s*"[^"]*")*\s*\}})'
            
            def replacer_without_id(match):
                return match.group(1) + f', youtubeId: "{youtube_id}"' + match.group(2)
            
            new_content = re.sub(
                pattern_without_id, 
                replacer_without_id, 
                content, 
                flags=re.DOTALL
            )
        
        content = new_content
    
    # Then, update Deezer data (ID and album cover only, no preview)
    for song_key, deezer_data in deezer_updates.items():
        title, artist = song_key
        deezer_id = deezer_data['deezerId']
        album_cover = deezer_data.get('albumCover', '')
        
        # Update deezerId
        pattern_with_id = rf'(\{{\s*title:\s*"{re.escape(title)}",\s*artist:\s*"{re.escape(artist)}",\s*year:\s*\d+,\s*youtubeId:\s*"[^"]*",\s*deezerId:\s*")[^"]*(")' 
        
        def replacer_with_id(match):
            return match.group(1) + deezer_id + match.group(2)
        
        new_content = re.sub(pattern_with_id, replacer_with_id, content, flags=re.DOTALL)
        
        # If no change, add deezerId
        if new_content == content:
            pattern_without_id = rf'(\{{\s*title:\s*"{re.escape(title)}",\s*artist:\s*"{re.escape(artist)}",\s*year:\s*\d+,\s*youtubeId:\s*"[^"]*")((?:,\s*albumCover:\s*"[^"]*")*\s*\}})'
            
            def replacer_without_id(match):
                return match.group(1) + f', deezerId: "{deezer_id}"' + match.group(2)
            
            new_content = re.sub(
                pattern_without_id, 
                replacer_without_id, 
                content, 
                flags=re.DOTALL
            )
        
        content = new_content
        
        # Update or add albumCover
        if album_cover:
            pattern_with_cover = rf'(\{{\s*title:\s*"{re.escape(title)}",\s*artist:\s*"{re.escape(artist)}",\s*year:\s*\d+,\s*youtubeId:\s*"[^"]*",\s*deezerId:\s*"[^"]*",\s*albumCover:\s*")[^"]*(")' 
            
            def replacer_with_cover(match):
                return match.group(1) + album_cover + match.group(2)
            
            new_content = re.sub(pattern_with_cover, replacer_with_cover, content, flags=re.DOTALL)
            
            if new_content == content:
                pattern_without_cover = rf'(\{{\s*title:\s*"{re.escape(title)}",\s*artist:\s*"{re.escape(artist)}",\s*year:\s*\d+,\s*youtubeId:\s*"[^"]*",\s*deezerId:\s*"[^"]*")(\s*\}})'
                
                def replacer_without_cover(match):
                    return match.group(1) + f', albumCover: "{album_cover}"' + match.group(2)
                
                new_content = re.sub(
                    pattern_without_cover, 
                    replacer_without_cover, 
                    content, 
                    flags=re.DOTALL
                )
            
            content = new_content
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    filepaths = [
        'src/data/english.js',
        'src/data/spanish.js'
    ]
    
    print("=" * 60)
    print("ID Updater for TimeSong Game")
    print("Fetches YouTube IDs, Deezer IDs, and album covers")
    print("=" * 60)
    print()
    
    for filepath in filepaths:
        print(f"\n{'='*60}")
        print(f"Processing: {filepath}")
        print('='*60)
        
        # Extract songs from file
        print("📖 Reading file...")
        songs, content = extract_songs_from_file(filepath)
        print(f"✓ Found {len(songs)} songs in file\n")
        
        # Find songs without YouTube IDs or complete Deezer data
        missing_youtube = [s for s in songs if not s['youtubeId'] or s['youtubeId'].strip() == '']
        missing_deezer = [s for s in songs if not s['deezerId'] or s['deezerId'].strip() == '' or not s['albumCover']]
        
        if not missing_youtube and not missing_deezer:
            print("✅ All songs already have YouTube IDs and complete Deezer data!")
            continue
        
        print(f"🔍 Found {len(missing_youtube)} songs without YouTube IDs")
        print(f"🔍 Found {len(missing_deezer)} songs without complete Deezer data\n")
        
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
        
        # Fetch missing Deezer data
        if missing_deezer:
            print("🎧 Fetching missing Deezer data (IDs, previews, covers)...\n")
            for i, song in enumerate(missing_deezer, 1):
                print(f"[{i}/{len(missing_deezer)}] {song['title']} - {song['artist']}")
                
                deezer_data = fetch_deezer_data(song['title'], song['artist'])
                
                if deezer_data:
                    deezer_updates[(song['title'], song['artist'])] = deezer_data
                    print(f"  ✓ Deezer ID: {deezer_data['deezerId']}")
                    if deezer_data.get('deezerPreview'):
                        print(f"  ✓ Preview: {deezer_data['deezerPreview'][:50]}...")
                    if deezer_data.get('albumCover'):
                        print(f"  ✓ Cover: {deezer_data['albumCover'][:50]}...")
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
        print(f"  Deezer Data - Successfully fetched: {len(deezer_updates)}, Failed: {len(deezer_failed)}")
        print("=" * 60)
        print()
        
        # Update the file
        if youtube_updates or deezer_updates:
            print(f"💾 Updating {filepath}...")
            update_songs_file(filepath, youtube_updates, deezer_updates)
            print(f"✓ Updated songs in {filepath}")
            if youtube_updates:
                print(f"  - Added/updated {len(youtube_updates)} YouTube IDs")
            if deezer_updates:
                print(f"  - Added/updated {len(deezer_updates)} Deezer entries (ID, preview, cover)")
        
        # Show failed songs
        if youtube_failed:
            print("\n⚠️  Failed to find YouTube IDs for:")
            for song in youtube_failed:
                print(f"  - {song['title']} by {song['artist']} ({song['year']})")
        
        if deezer_failed:
            print("\n⚠️  Failed to find Deezer data for:")
            for song in deezer_failed:
                print(f"  - {song['title']} by {song['artist']} ({song['year']})")
    
    if youtube_failed or deezer_failed:
        print("\nYou may need to manually add these entries.")
    
    print("\n✅ Done!")

if __name__ == "__main__":
    main()

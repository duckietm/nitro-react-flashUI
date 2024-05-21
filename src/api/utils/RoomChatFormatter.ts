import { GetConfiguration } from '../../api';

const allowedColours: Map<string, string> = new Map();

allowedColours.set('r', 'red');
allowedColours.set('b', 'blue');
allowedColours.set('g', 'green');
allowedColours.set('y', 'yellow');
allowedColours.set('w', 'white');
allowedColours.set('o', 'orange');
allowedColours.set('c', 'cyan');
allowedColours.set('br', 'brown');
allowedColours.set('pr', 'purple');
allowedColours.set('pk', 'pink');

allowedColours.set('red', 'red');
allowedColours.set('blue', 'blue');
allowedColours.set('green', 'green');
allowedColours.set('yellow', 'yellow');
allowedColours.set('white', 'white');
allowedColours.set('orange', 'orange');
allowedColours.set('cyan', 'cyan');
allowedColours.set('brown', 'brown');
allowedColours.set('purple', 'purple');
allowedColours.set('pink', 'pink');

const encodeHTML = (str: string) =>
{
    return str.replace(/([\u00A0-\u9999<>&])(.|$)/g, (full, char, next) =>
    {
        if(char !== '&' || next !== '#')
        {
            if(/[\u00A0-\u9999<>&]/.test(next)) next = '&#' + next.charCodeAt(0) + ';';

            return '&#' + char.charCodeAt(0) + ';' + next;
        }

        return full;
    });
}

export const RoomChatFormatter = (content: string) => {
    let result = '';

    content = encodeHTML(content);
    content = content.replace(/\[tag\](.*?)\[\/tag\]/g, '<span class="chat-tag"><b>$1</b></span>');

    // Youtube link
    if (!GetConfiguration<boolean>('youtube.publish.disabled', false)) {
        content = content.replace(
            /(?:http:\/\/|https:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?.*v=|shorts\/)?([a-zA-Z0-9_-]{11})/g,
            `
            <div>
				<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEQElEQVR4nO2X7WscRRzHt+AbfeEfICK+VVTwjWhVUnI7l8SkDY3Wu5ltfbiZXBNbq8ldiZEkVbHSIAEjCtUWNLXFaNWQElOUomKwD0bxoVLtk3I+oPhUjbvZ5x2Zmb29DUlaa3fTO9gvDOzMbx5+n535zYMkJUqUKFFNKoVIK0CEyogcKZfJCO/2y3qkaldLPn+ZDLEGELYbFeVyVgYgLnGADL5GqgUBRCaYwwC1NzUq5EruPCQnpVpRGpG87/RgGhJFLB88xGzyuvxVAOGtAOIXmU2SpGWsHKzNXcfaySh/Pe9DyeVSkNxzUQDkbO4KgIjH4kBGZLuAaa/j5ZD8LmZHJBniAd4Gtj8kynCXyBNVRuRX6WIJIDLN4gBA/CNzuq5uyyWhmRllQL69VJUAMsQDlT+NR3ynHhXLKVfkkJCcAZDoVQmQyuZuLAOkYPudNQcgSdIysZ0SWq/cf20tAkgyJDMJQHXNAN7ox8WTN6/pulRG2AAI/xZeQjLEj7ATG0BsVd0Sqs/iG2REHO64f70ACL/BbKEtVpUh+VvUqzIAJqDgewEip5lNRmQfO9xYeUNm/dUAkZ8AwidkmL+tKoI40VLJeGZbv97dWdIIVLVcRtOUVlPNrrR4urvZVlvrvSClb6Fq6iaR2HfYxur67TSl1eR9Eaiyvo1nB/ticV7vL04HDsWc9P5i8EiKRObw4GNL5bzqJzbbkQHo3R0/sE7dE99Qb2ZmXnK++HRRR6zxvbyO9fru85uFro7vIwPQcFZlnXq//EwXkvvtqUUdsQ/s53Xst8fOC0DLZdToANa1Gfyv9DxIjSd6qVv6Tjh+/Gue14sPRA+wdrURGYCaXWmHO3e+/Iw75Rz8UEx3X4Far45Qvb9AtUwz/7Z27ZwLMPUeNV9+gVqju6i2GlTW+uDj1Jl6n9ofHOD9BONkW+zoANrS7tkA7Mlx4eT+fVTvWi/WlefOAQjL+Ui0M3c8P8+mFzeIcdrSbnQALSu8CwVwjx0N6nnqP9zm/fmHaPfOBHVPnwz64OO0rPCiA2hYTi8UgMWA3vuwb/Ooesftlb9e6KTWm6Oiz+lDYpyG5TQ6gPCpGhVAc10A4GkapabpAxyOASCCJXQ2gLCcQ1MxLKEIgngOAKVzAPTuDrZtUn3zRjpLYAxBfI5t9H8BhGOguIFab/kx8PHB6LfR8kF2LgD31HG+2ywE4Bz9nFp7XhI22xK70F9neJYFsHvsK2GaHI/+ICtfJRYDsF7ZWVnEtr0gQFjMWd5u7555Nr1nU/RXifJlrpzM54aoPTFGjaGnxGB3NVL73Ul+cZvdRLjNGntNnLTbtvC8uX2Y/2m258/et8bfaW6l1sgODuR8coQaW/viuczV/HWaiT0ylsp5fWDzYSkOseeeXgg9KeEqq/KkbHL++5OyyQmelHCVFTwpC50lY/jp3licT5QoUSIpDv0L7jL5ksuHFDUAAAAASUVORK5CYII="
				alt="YouTube Icon" style="vertical-align: middle; margin-right: 5px;"><strong>Youtube Video has been send.</strong>
			</div>
			<center><a href="https://youtu.be/$1" target="_blank" style="background-color: red; color: white; padding: 2px 7px; border-radius: 3px; text-decoration: none;"><strong>Open Video</a></strong></center>
            `
        );
    }

    const match = content.match(/@[a-zA-Z]+@/);
    if (match) {
        const colorTag = match[0].toString();
        const colorName = colorTag.substr(1, colorTag.length - 2);
        const text = content.replace(colorTag, '');

        if (!allowedColours.has(colorName)) {
            result = text;
        } else {
            const color = allowedColours.get(colorName);
            result = `<span style="color: ${color}">${text}</span>`;
        }
    } else {
        result = content;
    }

    return result;
}
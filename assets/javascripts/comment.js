/**
 * Created by bedriy on 19.05.17.
 */

function ParseLinkHeader(link)
{
    var entries = link.split(",");
    var links = { };
    for (var i in entries)
    {
        var entry = entries[i];
        var link = { };
        link.name = entry.match(/rel=\"([^\"]*)/)[1];
        link.url = entry.match(/<([^>]*)/)[1];
        link.page = entry.match(/page=(\d+).*$/)[1];
        links[link.name] = link;
    }
    return links;

    function DoGithubComments(comment_id, page_id)
    {

        if (page_id === undefined)
            page_id = 1;}
}
var url = "https://github.com/ria-com/auto-ria-rest-api/issues/" + 4
var api_url = "https://api.github.com/repos/ria-com/auto-ria-rest-api/issues/" + 4 + "/comments"

$(document).ready(function () {
    $.ajax(api_url, {
        headers: {Accept: "application/vnd.github.v3.html+json"},
        dataType: "json",
        success: function(comments) {
            $("#gh-comments-list").append("");
            $.each(comments, function(i, comment) {

                var date = new Date(comment.created_at);

                var t = "<div id='gh-comment'>";
                t += "<img src='" + comment.user.avatar_url + "' width='24px'>";
                t += "<b><a href='" + comment.user.html_url + "'>" + comment.user.login + "</a></b>";
                t += " posted at ";
                t += "<em>" + date.toUTCString() + "</em>";
                t += "<div id='gh-comment-hr'></div>";
                t += comment.body_html;
                t += "</div>";
                $("#gh-comments-list").append(t);
            });
        },
        error: function() {
            $("#gh-comments-list").append("Comments are not open for this post yet.");
        }
    });
});
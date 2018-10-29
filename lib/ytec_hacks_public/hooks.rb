module YtecHacksPublicViewListener
  class Hooks < Redmine::Hook::ViewListener
    def view_layouts_base_body_bottom(context={ })
      tags = [                                             
          stylesheet_link_tag('header_numbers_on_wiki_pages', :plugin => "ytec_hacks_public"),
          stylesheet_link_tag('inline_code', :plugin => "ytec_hacks_public"),
          javascript_include_tag('hacks', :plugin => "ytec_hacks_public"),
      ]                                                    
      return tags.join("\n")
    end
  end
end

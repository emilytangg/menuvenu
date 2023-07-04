from flask import request, jsonify
from http import HTTPStatus
from app import app, db
from .models import Items, Categories, Ingredients, Contains

@app.route('/menu/add/categories', methods=['POST'])
def add_categories():
    """
    Add categories to menu 
    """
    data = request.get_json()

    app.logger.info(f"data from front end: {data}")

   
    category_name = data['name']

    category = Categories.query.filter_by(name = category_name).first()
    max_position = db.session.query(db.func.max(Categories.position)).scalar()
    next_position = max_position + 1 if max_position is not None else 1


    if category:
        return jsonify({'status': HTTPStatus.BAD_REQUEST, 'message': 'Category already exists'})

    else: 
        # Create a new Category instance
        category = Categories(name=category_name, position = next_position)

        # Add the category to the database
        db.session.add(category)
        db.session.commit()

        # Return a JSON response indicating success and the added category's details
        response = {
            'status': HTTPStatus.CREATED,
            'message': 'Category added successfully',
            'category': {
                'id': category.category_id,
                'name': category.name,
                'position': category.position
            }
        }
        return jsonify(response)


@app.route('/menu/add/items', methods=['POST'])
def add_items():
    """
    Add items to menu
    """
        # Get the item details from the request JSON data
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    image = data.get('image')
    price = data.get('price')
    category_id = data.get('category_id')
    calories = data.get('calories')
    position = data.get('position')
    points = data.get('points')

    # Create a new Items instance
    item = Items(
        name=name,
        description=description,
        image=image,
        price=price,
        category_id=category_id,
        calories=calories,
        position=position,
        points=points
    )

    # Add the item to the database
    db.session.add(item)
    db.session.commit()

    # Return a JSON response indicating success and the added item's details
    response = {
        'status': 'success',
        'message': 'Item added successfully',
        'item': {
            'item_id': item.item_id,
            'name': item.name,
            'description': item.description,
            'image': item.image,
            'price': float(item.price),
            'category_id': item.category_id,
            'calories': item.calories,
            'position': item.position,
            'points': item.points
        }
    }
    return jsonify(response)

    

@app.route('/menu/items', methods=['DELETE'])
def delete_items():
    """
    Delete items from menu
    """
    item = Items.query.get(item_id)
    if not item:
        return jsonify({'status': 404, 'message': 'Item not found'})

    db.session.delete(item)
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'Item deleted successfully'})
    

@app.route('/menu/categories', methods=['DELETE'])
def delete_categories():
    """
    Delete categories from menu
    """
    category = Categories.query.get(category_id)
    if not category:
        return jsonify({'status': 404, 'message': 'Category not found'})

    db.session.delete(category)
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'Category deleted successfully'})

@app.route('/menu/items/<category_id>', methods=['GET'])
def get_items(category_id):

    app.logger.info(f"category_id: {category_id}")

    category = Categories.query.get(category_id)

    if not category:
        return jsonify({'status': 404, 'message': 'Category not found'})
    
    item_list = []

    for item in category.items:
        item_list.append(item.to_dict())

    return jsonify({'status': 200, 'message': 'Items found', 'items': item_list})
    

@app.route('/menu/categories', methods=['GET'])
def get_categories():
    
    app.logger.info("Getting categories from database")

    categories = Categories.query.all()

    category_list = [categories.to_dict() for categories in categories]

    return jsonify({'status': 200, 'message': 'Categories found', 'categories': category_list})


@app.route('/menu/item/position', methods=['PUT'])
def update_item_position():
    
    data = request.get_json()
    app.logger.info(f"data: {data}")

    item = Items.query.get(data['item_id'])

    if not item:
        return jsonify({'status': 404, 'message': 'Item not found'})
    
    item.position = data['position']
    db.session.commit()

    return jsonify({'status': 200, 'message': 'Item position updated'})


@app.route('/menu/category/position', methods=['PUT'])
def update_category_position():

    data = request.get_json()
    app.logger.info(f"data: {data}")

    category = Categories.query.get(data['category_id'])

    if not category:
        return jsonify({'status': 404, 'message': 'Category not found'})
    
    category.position = data['position']
    db.session.commit()

    return jsonify({'status': 200, 'message': 'Category position updated'})

@app.route('/menu/item/details/<item_id>', methods=['GET'])
def get_item_details(item_id):
    
    app.logger.info("Getting item details from database")

    item = Items.query.get(item_id)

    if not item:
        return jsonify({'status': 404, 'message': 'Item not found'})
    
    return jsonify({'status': 200, 'message': 'Item found', 'item': item.to_dict()})

@app.route('/menu/items', methods=['PUT'])
def update_items():
    """
    Update items
    """
    pass

@app.route('/menu/categories', methods=['PUT'])
def update_categories():
    """
    Update categories
    """
    pass    

